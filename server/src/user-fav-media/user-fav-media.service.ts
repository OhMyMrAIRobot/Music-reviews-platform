import { ConflictException, Injectable } from '@nestjs/common';
import { UserFavMedia } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { ReleaseMediaStatusesEnum } from 'src/release-media-statuses/types/release-media-statuses.enum';
import { ReleaseMediaTypesEnum } from 'src/release-media-types/types/release-media-types.enum';
import { ReleaseMediaService } from 'src/release-media/release-media.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { UsersService } from 'src/users/users.service';
import { FindUserFavByMediaIdResponseDto } from './dto/response/find-user-fav-by-media-id.response.dto';

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

  async findByMediaId(
    mediaId: string,
  ): Promise<FindUserFavByMediaIdResponseDto> {
    const media = await this.prisma.releaseMedia.findUnique({
      where: { id: mediaId },
      select: {
        id: true,
        release: {
          select: {
            releaseProducer: { select: { authorId: true } },
            releaseArtist: { select: { authorId: true } },
            releaseDesigner: { select: { authorId: true } },
          },
        },
      },
    });

    if (!media) {
      throw new EntityNotFoundException('Медиарецензия', 'id', mediaId);
    }

    const favs = await this.prisma.userFavMedia.findMany({
      where: { mediaId },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profile: { select: { avatar: true } },
            registeredAuthor: { select: { authorId: true } },
          },
        },
      },
    });

    return plainToInstance(
      FindUserFavByMediaIdResponseDto,
      {
        userFavMedia: favs,
        release: media.release,
      },
      { excludeExtraneousValues: true },
    );
  }

  async remove(mediaId: string, userId: string): Promise<UserFavMedia> {
    await this.releaseMediaService.findById(mediaId);
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
