import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserProfile } from '@prisma/client';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { FileService } from 'src/file/files.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';
import { NoDataProvidedException } from '../../exceptions/no-data.exception';
import {
  PreferredResponseDto,
  QueryPreferredResponseDto,
} from '../dto/preferred.response.dto';
import {
  ProfileResponseDto,
  QueryProfileResponseDto,
} from '../dto/profile.response.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

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
    avatar?: Express.Multer.File,
    cover?: Express.Multer.File,
  ): Promise<UserProfile> {
    if (Object.keys(updateProfileDto).length === 0 && !avatar && !cover) {
      throw new NoDataProvidedException();
    }

    const profile = await this.findByUserId(userId);

    let newAvatarPath: string | undefined = undefined;
    let newCoverPath: string | undefined = undefined;

    try {
      if (updateProfileDto.clearAvatar) {
        newAvatarPath = '';
      }

      if (updateProfileDto.clearCover) {
        newCoverPath = '';
      }

      if (avatar && updateProfileDto.clearAvatar !== true) {
        newAvatarPath = await this.fileService.saveFile(avatar, 'avatars');
      }

      if (cover && updateProfileDto.clearCover !== true) {
        newCoverPath = await this.fileService.saveFile(cover, 'covers');
      }

      const updated = await this.prisma.userProfile.update({
        where: { userId },
        data: {
          bio: updateProfileDto.bio,
          avatar: newAvatarPath,
          coverImage: newCoverPath,
        },
      });

      if (updateProfileDto.clearAvatar || avatar) {
        await this.fileService.deleteFile('avatars/' + profile.avatar);
      }

      if (updateProfileDto.clearCover || cover) {
        await this.fileService.deleteFile('covers/' + profile.coverImage);
      }
      return updated;
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

  async adminUpdate(
    req: IAuthenticatedRequest,
    userId: string,
    dto: UpdateProfileDto,
  ) {
    await this.usersService.checkPermissions(req.user, userId);

    return this.updateByUserId(userId, dto);
  }

  async findByUserIdExtended(userId: string): Promise<ProfileResponseDto> {
    await this.findByUserId(userId);
    const rawQuery = `
      SELECT * FROM user_profile_summary WHERE id = '${userId}'
    `;

    const result =
      await this.prisma.$queryRawUnsafe<QueryProfileResponseDto>(rawQuery);

    return result[0];
  }

  async findPreferred(userId: string): Promise<PreferredResponseDto> {
    const result = await this.prisma
      .$queryRawUnsafe<QueryPreferredResponseDto>(`
        WITH
            user_fav_authors AS (
                SELECT
                    a.*,
                    at.id AS author_type_id
                FROM "Authors" a
                    JOIN "User_fav_authors" ufa ON a.id = ufa.author_id
                    JOIN "Authors_on_types" aot ON a.id = aot.author_id
                    JOIN "Author_types" at ON aot.author_type_id = at.id
                WHERE ufa.user_id = '${userId}'
            ),

            user_fav_releases AS (
                SELECT
                    r.*
                FROM "Releases" r
                    JOIN "User_fav_releases" ufr ON r.id = ufr.release_id
                    JOIN "Release_types" rt ON r.release_type_id = rt.id
                WHERE ufr.user_id = '${userId}'
            )

            SELECT
                u.id AS user_id,
                (
                    SELECT jsonb_agg(jsonb_build_object(
                            'id', a.id,
                            'name', a.name,
                            'image', a.avatar_img
                    ))
                    FROM user_fav_authors a
                    WHERE a.author_type_id = '1'
                ) AS artists,

                (
                    SELECT jsonb_agg(jsonb_build_object(
                            'id', a.id,
                            'name', a.name,
                            'image', a.avatar_img
                    ))
                    FROM user_fav_authors a
                    WHERE a.author_type_id = '2'
                ) AS producers,

                (
                    SELECT jsonb_agg(jsonb_build_object(
                            'id', r.id,
                            'name', r.title,
                            'image', r.img
                    ))
                    FROM user_fav_releases r
                    WHERE r.release_type_id = '3'
                ) AS tracks,

                (
                    SELECT jsonb_agg(jsonb_build_object(
                            'id', r.id,
                            'name', r.title,
                            'image', r.img
                    ))
                    FROM user_fav_releases r
                    WHERE r.release_type_id = '1'
                ) AS albums
            FROM "Users" u
            WHERE u.id = '${userId}';
        `);

    return result[0];
  }
}
