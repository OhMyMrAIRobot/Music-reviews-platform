import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma, UserProfile } from '@prisma/client';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { FileService } from 'src/file/files.service';
import { SocialMediaService } from 'src/social-media/social-media.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EntityNotFoundException } from '../shared/exceptions/entity-not-found.exception';
import { NoDataProvidedException } from '../shared/exceptions/no-data.exception';
import { UpdateProfileRequestDto } from './dto/request/update-profile.request.dto';
import { ProfilePreferencesResponseDto } from './dto/response/profile-preferences.response.dto';
import { ProfileDto } from './dto/response/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
    private readonly socialMediaService: SocialMediaService,
  ) {}

  /**
   * Find a raw `UserProfile` record by `userId`.
   *
   * Throws `EntityNotFoundException` when the profile does not exist.
   *
   * @param userId User identifier
   * @returns `UserProfile` Prisma model instance
   */
  async findOne(userId: string): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new EntityNotFoundException('Профиль', 'userId', `${userId}`);
    }

    return profile;
  }

  /**
   * Return the rich `ProfileDto` payload for a given user id.
   *
   * The payload is assembled by a raw SQL query that returns a single
   * JSON object with nested `user`, `socials` and `stats` fields. If no
   * profile is found an `EntityNotFoundException` is thrown.
   *
   * @param userId Target user id
   * @returns `ProfileDto` with nested account and statistics
   */
  async findByUserId(userId: string): Promise<ProfileDto> {
    const profiles = await this.executeProfileRawQuery({ userId });

    if (profiles.length === 0) {
      throw new EntityNotFoundException('Профиль', 'userId', `${userId}`);
    }

    return profiles[0];
  }

  /**
   * Return the user's preferences grouped by category.
   *
   * Delegates to a raw SQL query that returns arrays of minimal
   * preference objects. Throws `EntityNotFoundException` when the
   * user/profile is not present.
   *
   * @param userId Target user id
   * @returns `ProfilePreferencesResponseDto` grouping preferences
   */
  async findProfilePreferences(
    userId: string,
  ): Promise<ProfilePreferencesResponseDto> {
    const prefs = await this.executeProfilePreferencesRawQuery({ userId });

    if (prefs.length === 0) {
      throw new EntityNotFoundException('Профиль', 'userId', `${userId}`);
    }

    return prefs[0];
  }

  /**
   * Update profile fields for the given user id.
   *
   * Handles optional avatar and cover file uploads, supports clearing
   * existing images via `clearAvatar`/`clearCover` flags and ensures
   * proper cleanup on error (removes newly saved files when the
   * update fails).
   *
   * @param userId Target user id
   * @param dto Partial update DTO with optional `bio`, `clearAvatar`, `clearCover`
   * @param avatar Optional uploaded avatar file
   * @param cover Optional uploaded cover file
   * @returns Updated `ProfileDto` after successful update
   */
  async updateByUserId(
    userId: string,
    dto: UpdateProfileRequestDto,
    avatar?: Express.Multer.File,
    cover?: Express.Multer.File,
  ): Promise<ProfileDto> {
    if (Object.keys(dto).length === 0 && !avatar && !cover) {
      throw new NoDataProvidedException();
    }

    const profile = await this.findOne(userId);

    let newAvatarPath: string | undefined = undefined;
    let newCoverPath: string | undefined = undefined;

    try {
      if (dto.clearAvatar) {
        newAvatarPath = '';
      }

      if (dto.clearCover) {
        newCoverPath = '';
      }

      if (avatar && dto.clearAvatar !== true) {
        newAvatarPath = await this.fileService.saveFile(avatar, 'avatars');
      }

      if (cover && dto.clearCover !== true) {
        newCoverPath = await this.fileService.saveFile(cover, 'covers');
      }

      // Perform profile update and associated social-media changes in a single DB transaction so profile row and profile-social entries are committed atomically.
      const updated = await this.prisma.$transaction(async (tx) => {
        const updatedProfile = await tx.userProfile.update({
          where: { userId },
          data: {
            bio: dto.bio,
            avatar: newAvatarPath,
            coverImage: newCoverPath,
          },
        });

        if (dto.socials && Array.isArray(dto.socials)) {
          for (const item of dto.socials) {
            const socialId = item.socialId;
            const url = item.url ?? '';

            // Validate that the social media exists within the transaction.
            const social = await tx.socialMedia.findUnique({
              where: { id: socialId },
            });
            if (!social) {
              throw new EntityNotFoundException(
                'Социльная сеть',
                'id',
                `${socialId}`,
              );
            }

            const existing = await tx.profileSocialMedia.findUnique({
              where: {
                profileId_socialId: { profileId: updatedProfile.id, socialId },
              },
            });

            if (!url || url.trim() === '') {
              if (existing) {
                await tx.profileSocialMedia.delete({
                  where: {
                    profileId_socialId: {
                      profileId: updatedProfile.id,
                      socialId,
                    },
                  },
                });
              }
            } else {
              if (existing) {
                await tx.profileSocialMedia.update({
                  where: {
                    profileId_socialId: {
                      profileId: updatedProfile.id,
                      socialId,
                    },
                  },
                  data: { url },
                });
              } else {
                await tx.profileSocialMedia.create({
                  data: { profileId: updatedProfile.id, socialId, url },
                });
              }
            }
          }
        }

        return updatedProfile;
      });

      if (dto.clearAvatar || avatar) {
        await this.fileService.deleteFile('avatars/' + profile.avatar);
      }

      if (dto.clearCover || cover) {
        await this.fileService.deleteFile('covers/' + profile.coverImage);
      }

      return this.findByUserId(updated.userId);
    } catch {
      if (newAvatarPath) {
        await this.fileService.deleteFile('avatars/' + newAvatarPath);
      }
      if (newCoverPath) {
        await this.fileService.deleteFile('covers/' + newCoverPath);
      }

      throw new InternalServerErrorException();
    }
  }

  /**
   * Administrative update entrypoint used by controllers to perform
   * profile updates on behalf of another user.
   *
   * Verifies that the caller has appropriate permissions before
   * delegating to `updateByUserId`.
   *
   * @param req Authenticated request of the admin
   * @param userId Target user id
   * @param dto Partial profile update DTO
   */
  async adminUpdate(
    req: IAuthenticatedRequest,
    userId: string,
    dto: UpdateProfileRequestDto,
  ): Promise<ProfileDto> {
    await this.usersService.checkPermissions(req.user, userId);

    return this.updateByUserId(userId, dto);
  }

  /**
   * Execute a complex raw SQL query that builds the expanded `ProfileDto`
   * JSON structure. The query accepts an optional `userId` parameter to
   * limit the result to a single profile.
   *
   * @param params Query parameters (optional `userId`)
   * @returns Array of `ProfileDto` objects (usually single-element when `userId` provided)
   */
  async executeProfileRawQuery(params: {
    userId?: string;
  }): Promise<ProfileDto[]> {
    const { userId = null } = params;

    const sql = Prisma.sql`
      WITH params AS (
          SELECT
              ${userId}::text AS user_id
      ),

      release_participants AS (
          SELECT release_id, author_id FROM "Release_artists"
          UNION
          SELECT release_id, author_id FROM "Release_producers"
          UNION
          SELECT release_id, author_id FROM "Release_designers"
      ),

      -- review counts per user
      review_counts AS (
          SELECT
              rev.user_id,
              COUNT(DISTINCT rev.id) FILTER (WHERE rev.text IS NOT NULL)::int AS text_count,
              COUNT(DISTINCT rev.id) FILTER (WHERE rev.text IS NULL)::int AS without_text_count
          FROM "Reviews" rev
          GROUP BY rev.user_id
      ),

      -- received likes: reviews
      received_likes_reviews AS (
          SELECT rev.user_id, COUNT(*)::int AS cnt
          FROM "User_fav_reviews" ufr
          JOIN "Reviews" rev ON rev.id = ufr.review_id
          GROUP BY rev.user_id
      ),

      -- received likes: media
      received_likes_media AS (
          SELECT rm.user_id, COUNT(*)::int AS cnt
          FROM "User_fav_media" ufm
          JOIN "Release_media" rm ON rm.id = ufm.media_id
          GROUP BY rm.user_id
      ),

      received_likes_total AS (
          SELECT
              COALESCE(rr.user_id, rm.user_id) AS user_id,
              (COALESCE(rr.cnt,0) + COALESCE(rm.cnt,0))::int AS total_received_likes
          FROM received_likes_reviews rr
          FULL JOIN received_likes_media rm USING (user_id)
      ),

      -- given likes: reviews to others
      given_likes_reviews AS (
          SELECT ufr.user_id AS user_id, COUNT(*)::int AS cnt
          FROM "User_fav_reviews" ufr
          JOIN "Reviews" rev ON rev.id = ufr.review_id
          WHERE rev.user_id IS DISTINCT FROM ufr.user_id
          GROUP BY ufr.user_id
      ),

      -- given likes: media to others
      given_likes_media AS (
          SELECT ufm.user_id AS user_id, COUNT(*)::int AS cnt
          FROM "User_fav_media" ufm
          JOIN "Release_media" rm ON rm.id = ufm.media_id
          WHERE rm.user_id IS DISTINCT FROM ufm.user_id
          GROUP BY ufm.user_id
      ),

      given_likes_total AS (
          SELECT
              COALESCE(gr.user_id, gm.user_id) AS user_id,
              (COALESCE(gr.cnt,0) + COALESCE(gm.cnt,0))::int AS total_given_likes
          FROM given_likes_reviews gr
          FULL JOIN given_likes_media gm USING (user_id)
      ),

      -- author comments count
      author_comments_count AS (
          SELECT ac.user_id, COUNT(DISTINCT ac.id)::int AS cnt
          FROM "Author_comments" ac
          GROUP BY ac.user_id
      ),

      -- received author likes: reviews (likes from registered authors participating in the release)
      received_author_likes_reviews AS (
          SELECT rev.user_id AS user_id, COUNT(*)::int AS cnt
          FROM "User_fav_reviews" ufr
          JOIN "Reviews" rev ON rev.id = ufr.review_id
          JOIN "Registered_authors" ra ON ra.user_id = ufr.user_id
          JOIN release_participants rp ON rp.release_id = rev.release_id AND rp.author_id = ra.author_id
          GROUP BY rev.user_id
      ),

      -- received author likes: media
      received_author_likes_media AS (
          SELECT rm.user_id AS user_id, COUNT(*)::int AS cnt
          FROM "User_fav_media" ufm
          JOIN "Release_media" rm ON rm.id = ufm.media_id
          JOIN "Registered_authors" ra ON ra.user_id = ufm.user_id
          JOIN release_participants rp ON rp.release_id = rm.release_id AND rp.author_id = ra.author_id
          GROUP BY rm.user_id
      ),

      received_author_likes_total AS (
          SELECT
              COALESCE(rr.user_id, rm.user_id) AS user_id,
              (COALESCE(rr.cnt,0) + COALESCE(rm.cnt,0))::int AS total_author_likes
          FROM received_author_likes_reviews rr
            FULL JOIN received_author_likes_media rm USING (user_id)
      ),

      -- given author likes: likes that a registered-author user gave (to others' reviews/media)
      given_author_likes_reviews AS (
          SELECT ra.user_id AS user_id, COUNT(*)::int AS cnt
          FROM "User_fav_reviews" ufr
            JOIN "Reviews" rev ON rev.id = ufr.review_id
            JOIN "Registered_authors" ra ON ra.user_id = ufr.user_id
            JOIN release_participants rp ON rp.release_id = rev.release_id AND rp.author_id = ra.author_id
          WHERE rev.user_id IS DISTINCT FROM ufr.user_id
          GROUP BY ra.user_id
      ),

      given_author_likes_media AS (
          SELECT ra.user_id AS user_id, COUNT(*)::int AS cnt
          FROM "User_fav_media" ufm
            JOIN "Release_media" rm ON rm.id = ufm.media_id
            JOIN "Registered_authors" ra ON ra.user_id = ufm.user_id
            JOIN release_participants rp ON rp.release_id = rm.release_id AND rp.author_id = ra.author_id
          WHERE rm.user_id IS DISTINCT FROM ufm.user_id
          GROUP BY ra.user_id
      ),

      given_author_likes_total AS (
          SELECT
              COALESCE(gr.user_id, gm.user_id) AS user_id,
              (COALESCE(gr.cnt,0) + COALESCE(gm.cnt,0))::int AS total_given_author_likes
          FROM given_author_likes_reviews gr
            FULL JOIN given_author_likes_media gm USING (user_id)
      )

      SELECT
          up.id,
          up.bio,
          up.avatar,
          up.cover_image AS cover,
          COALESCE(up.points, 0) AS points,
          tul.rank AS rank,
          u.created_at AS "createdAt",

          -- User info
          jsonb_build_object(
              'id', u.id,
              'nickname', u.nickname,
              'role', jsonb_build_object(
                          'id', rol.id,
                          'role', rol.role
                      ),
              'isAuthor', EXISTS(
                              SELECT 1 FROM "Registered_authors" ra WHERE ra.user_id = u.id
                        ),
              'authorTypes', COALESCE(
                  (
                      SELECT jsonb_agg(DISTINCT jsonb_build_object('id', at.id, 'type', at.type))
                      FROM "Registered_authors" ra
                        JOIN "Authors" a ON ra.author_id = a.id
                        JOIN "Authors_on_types" aot ON a.id = aot.author_id
                        JOIN "Author_types" at ON aot.author_type_id = at.id
                      WHERE ra.user_id = u.id
                  ),
                  '[]'::jsonb
              )
          ) AS "user",

          -- socials via lateral to keep single-row output (preserve original structure)
          COALESCE(
              (
                  SELECT CASE WHEN COUNT(psm.id) = 0 THEN '[]'::jsonb
                      ELSE jsonb_agg(DISTINCT jsonb_build_object('id', sm.id, 'name', sm.name, 'url', psm.url))
                  END
                  FROM "Profile_social_media" psm
                    JOIN "Social_media" sm ON psm.social_id = sm.id
                  WHERE psm.profile_id = up.id
              ),
              '[]'::jsonb
          ) AS socials,

          jsonb_build_object(
              'textCount', COALESCE(rc.text_count, 0),
              'withoutTextCount', COALESCE(rc.without_text_count, 0),
              'receivedLikes', COALESCE(rlt.total_received_likes, 0),
              'givenLikes', COALESCE(glt.total_given_likes, 0),
              'authorCommentsCount', COALESCE(acc.cnt, 0),
              'receivedAuthorLikes', COALESCE(ralt.total_author_likes, 0),
              'givenAuthorLikes', COALESCE(galt.total_given_author_likes, 0)
          ) AS stats

      FROM "User_profiles" up
        JOIN "Users" u ON up.user_id = u.id
        LEFT JOIN "Top_users_leaderboard" tul ON up.user_id = tul.user_id
        LEFT JOIN "Roles" rol ON u.role_id = rol.id
        LEFT JOIN review_counts rc ON rc.user_id = u.id
        LEFT JOIN received_likes_total rlt ON rlt.user_id = u.id
        LEFT JOIN given_likes_total glt ON glt.user_id = u.id
        LEFT JOIN author_comments_count acc ON acc.user_id = u.id
        LEFT JOIN received_author_likes_total ralt ON ralt.user_id = u.id
        LEFT JOIN given_author_likes_total galt ON galt.user_id = u.id
      WHERE (SELECT user_id FROM params) IS NULL OR u.id::text = (SELECT user_id FROM params);
    `;

    return this.prisma.$queryRaw<ProfileDto[]>(sql);
  }

  /**
   * Execute a raw SQL query that returns the profile preferences
   * grouped by categories (artists, producers, tracks, albums).
   *
   * @param params Object containing the `userId`
   * @returns Array with one `ProfilePreferencesResponseDto` for the user
   */
  executeProfilePreferencesRawQuery(params: {
    userId: string;
  }): Promise<ProfilePreferencesResponseDto[]> {
    const { userId } = params;

    const sql = Prisma.sql`
      WITH params AS (
          SELECT ${userId}::text AS user_id
      ),

          user_fav_authors AS (
              SELECT
                  a.id,
                  a.name,
                  a.avatar_img,
                  at.id::text AS author_type_id
              FROM "Authors" a
                  JOIN "User_fav_authors" ufa
                      ON a.id = ufa.author_id
                          AND ufa.user_id::text = (SELECT user_id FROM params)
                  JOIN "Authors_on_types" aot ON a.id = aot.author_id
                  JOIN "Author_types" at ON aot.author_type_id = at.id
          ),

          user_fav_releases AS (
              SELECT
                  r.id,
                  r.title,
                  r.img,
                  r.release_type_id::text AS release_type_id
              FROM "Releases" r
                  JOIN "User_fav_releases" ufr
                      ON r.id = ufr.release_id
                          AND ufr.user_id::text = (SELECT user_id FROM params)
                  JOIN "Release_types" rt ON r.release_type_id = rt.id
          )

      SELECT
          u.id AS "userId",

          COALESCE((
                  SELECT jsonb_agg(
                              jsonb_build_object(
                                      'id', a.id,
                                      'name', a.name,
                                      'img', a.avatar_img) ORDER BY a.name
                              )
                  FROM user_fav_authors a
                  WHERE a.author_type_id = '1'
              ),
              '[]'::jsonb
          ) AS artists,

          COALESCE((
                  SELECT jsonb_agg(
                              jsonb_build_object(
                                      'id', a.id,
                                      'name', a.name,
                                      'img', a.avatar_img) ORDER BY a.name
                              )
                  FROM user_fav_authors a
                  WHERE a.author_type_id = '2'
              ),
              '[]'::jsonb
          ) AS producers,

          COALESCE((
                  SELECT jsonb_agg(
                              jsonb_build_object(
                                      'id', r.id,
                                      'name', r.title,
                                      'img', r.img) ORDER BY r.title
                              )
                  FROM user_fav_releases r
                  WHERE r.release_type_id = '3'
              ),
              '[]'::jsonb
          ) AS tracks,

          COALESCE((
                  SELECT jsonb_agg(
                              jsonb_build_object(
                                      'id', r.id,
                                      'name', r.title,
                                      'img', r.img) ORDER BY r.title
                              )
                  FROM user_fav_releases r
                  WHERE r.release_type_id = '1'
              ),
              '[]'::jsonb
          ) AS albums
      FROM "Users" u
      WHERE u.id::text = (SELECT user_id FROM params);
      `;

    return this.prisma.$queryRaw<ProfilePreferencesResponseDto[]>(sql);
  }
}
