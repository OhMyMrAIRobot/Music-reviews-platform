import { Injectable } from '@nestjs/common';
import { UserProfile } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';
import { NoDataProvidedException } from '../../exceptions/no-data.exception';
import {
  ProfileResponseDto,
  QueryProfileResponseDto,
} from '../dto/profile.response.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserProfile[]> {
    return this.prisma.userProfile.findMany();
  }

  async findByUserId(userId: string): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new EntityNotFoundException('Профиль', 'userId', `${userId}`);
    }

    return profile;
  }

  async updateByUserId(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfile> {
    if (!updateProfileDto || Object.keys(updateProfileDto).length === 0) {
      throw new NoDataProvidedException();
    }

    await this.findByUserId(userId);

    return this.prisma.userProfile.update({
      where: { userId },
      data: updateProfileDto,
    });
  }

  async findByUserIdExtended(userId: string): Promise<ProfileResponseDto> {
    await this.findByUserId(userId);
    const rawQuery = `
      SELECT
          u.nickname,
          (
              SELECT TO_CHAR(u.created_at, 'DD.MM.YYYY') AS created_at
          ),
          up.bio,
          up.avatar,
          up.cover_image as cover,
          up.points,
          tul.rank AS position,
          (count(DISTINCT r.id) FILTER (WHERE r.text IS NOT NULL))::int AS text_count,
          (count(DISTINCT r.id) FILTER (WHERE r.text IS NULL))::int AS no_text_count,
          (SELECT COUNT(*)
            FROM "User_fav_reviews" ufr
          JOIN "Reviews" rev ON ufr.review_id = rev.id
          WHERE rev.user_id = u.id)::int AS received_likes,
          (SELECT COUNT(*)
              FROM "User_fav_reviews" ufr
                  JOIN "Reviews" rev ON ufr.review_id = rev.id
              WHERE ufr.user_id = u.id AND rev.user_id != u.id)::int AS given_likes,
          json_agg(DISTINCT jsonb_build_object('name', sm.name, 'url', psm.url)) as social

      FROM "User_profiles" up
          JOIN "Users" u on up.user_id = u.id
          LEFT JOIN "Top_users_leaderboard" tul ON up.user_id = tul.user_id
          LEFT JOIN "Reviews" r on u.id = r.user_id
          LEFT JOIN "Profile_social_media" psm on up.id = psm.profile_id
          LEFT JOIN "Social_media" sm on psm.social_id = sm.id
      WHERE u.id = '${userId}'
      GROUP BY u.id, u.nickname, u.created_at, u.nickname, up.bio, up.avatar, up.cover_image, up.points, tul.rank
    `;

    const result =
      await this.prisma.$queryRawUnsafe<QueryProfileResponseDto>(rawQuery);

    return result[0];
  }
}
