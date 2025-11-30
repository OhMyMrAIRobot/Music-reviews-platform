import { ConflictException, Injectable } from '@nestjs/common';
import { UserFavMedia } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ReleaseMediaStatusesEnum } from 'src/release-media-statuses/types/release-media-statuses.enum';
import { ReleaseMediaTypesEnum } from 'src/release-media-types/types/release-media-types.enum';
import { ReleaseMediaService } from 'src/release-media/release-media.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserFavMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly releaseMediaService: ReleaseMediaService,
  ) {}

  /**
   * Add media to user's favorites.
   *
   * Validates that:
   * - user and media exist
   * - user is not the media owner
   * - media is an approved media review
   * - favorite doesn't already exist
   *
   * @param mediaId - id of the media to favorite
   * @param userId - id of the user adding the favorite
   * @returns created UserFavMedia record
   * @throws ConflictException when user owns the media, media is not eligible, or already favorited
   */
  async create(mediaId: string, userId: string): Promise<UserFavMedia> {
    await this.usersService.findOne(userId);
    const media = await this.releaseMediaService.findOne(mediaId);

    if (media.userId === userId) {
      throw new ConflictException(
        'Вы не можете отметить свою медиарецензию как понравившеюся!',
      );
    }

    if (
      media.releaseMediaStatus.status !==
        (ReleaseMediaStatusesEnum.APPROVED as string) ||
      media.releaseMediaType.type !==
        (ReleaseMediaTypesEnum.MEDIA_REVIEW as string)
    ) {
      throw new ConflictException(
        'Вы не можете отметить данное медиа как понравившееся!',
      );
    }

    const exist = await this.findByMediaUserIds(mediaId, userId);

    if (exist) {
      throw new ConflictException('Вы уже отметили медиа как понравившееся!');
    }

    return this.prisma.userFavMedia.create({
      data: {
        userId,
        mediaId,
      },
    });
  }

  /**
   * Remove media from user's favorites.
   *
   * Validates that both user and media exist, ensures the favorite
   * exists, then removes the association.
   *
   * @param mediaId - id of the media to unfavorite
   * @param userId - id of the user removing the favorite
   * @returns deleted UserFavMedia record
   * @throws ConflictException when the media was not favorited
   */
  async remove(mediaId: string, userId: string): Promise<UserFavMedia> {
    await this.releaseMediaService.findOne(mediaId);
    await this.usersService.findOne(userId);

    const exist = await this.findByMediaUserIds(mediaId, userId);

    if (!exist) {
      throw new ConflictException(
        'Вы не отмечали данное медиа как понравившееся!',
      );
    }

    return this.prisma.userFavMedia.delete({
      where: {
        userId_mediaId: { userId, mediaId },
      },
    });
  }

  /**
   * Check if a specific user-media favorite relationship exists.
   *
   * Internal helper used to prevent duplicates and validate removals.
   *
   * @param mediaId - id of the media
   * @param userId - id of the user
   * @returns UserFavMedia record if exists, null otherwise
   */
  private findByMediaUserIds(
    mediaId: string,
    userId: string,
  ): Promise<UserFavMedia | null> {
    return this.prisma.userFavMedia.findUnique({
      where: {
        userId_mediaId: { userId, mediaId },
      },
    });
  }
}
