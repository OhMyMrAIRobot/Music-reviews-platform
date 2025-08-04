import { ConflictException, Injectable } from '@nestjs/common';
import { UserFavMedia } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ReleaseMediaStatusesEnum } from 'src/release-media-statuses/entities/release-media-statuses.enum';
import { ReleaseMediaTypesEnum } from 'src/release-media-types/entities/release-media-types.enum';
import { ReleaseMediaService } from 'src/release-media/release-media.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserFavMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly releaseMediaService: ReleaseMediaService,
  ) {}

  async create(mediaId: string, userId: string): Promise<UserFavMedia> {
    await this.usersService.findOne(userId);
    const media = await this.releaseMediaService.findById(mediaId);

    if (
      media.releaseMediaStatus.status !==
        (ReleaseMediaStatusesEnum.APPROVED as string) &&
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

  async findByMediaId(mediaId: string): Promise<UserFavMedia[]> {
    await this.releaseMediaService.findById(mediaId);
    return this.prisma.userFavMedia.findMany({
      where: { mediaId },
    });
  }

  async findByUserId(userId: string): Promise<UserFavMedia[]> {
    await this.usersService.findOne(userId);
    return this.prisma.userFavMedia.findMany({
      where: { userId },
    });
  }

  async remove(mediaId: string, userId: string): Promise<UserFavMedia> {
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
