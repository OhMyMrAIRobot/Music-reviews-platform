import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { ReleaseMediaStatusesEnum } from 'src/release-media-statuses/types/release-media-statuses.enum';
import { ReleasesService } from 'src/releases/releases.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { InsufficientPermissionsException } from 'src/shared/exceptions/insufficient-permissions.exception';
import { NoDataProvidedException } from 'src/shared/exceptions/no-data.exception';
import { UsersService } from 'src/users/users.service';
import { ReleaseMediaStatusesService } from '../../src/release-media-statuses/release-media-statuses.service';
import { ReleaseMediaTypesService } from '../../src/release-media-types/release-media-types.service';
import { CreateReleaseMediaDto } from './dto/create-release-media.dto';
import { ReleaseMediaRequestQuery } from './dto/request/query/release-media.request.query.dto';
import { ReleaseMediaListResponseDto } from './dto/response/release-media-list.response.dto';
import { ReleaseMediaResponseDto } from './dto/response/release-media.response.dto';
import { UpdateReleaseMediaDto } from './dto/update-release-media.dto';

@Injectable()
export class ReleaseMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly releaseMediaStatusesService: ReleaseMediaStatusesService,
    private readonly releaseMediaTypesService: ReleaseMediaTypesService,
    private readonly releasesService: ReleasesService,
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) {}

  async create(dto: CreateReleaseMediaDto): Promise<ReleaseMediaResponseDto> {
    await this.releasesService.findOne(dto.releaseId);

    let reviewId: string | null = null;

    if (dto.userId) {
      await this.usersService.findOne(dto.userId);

      const existByUserRelease = await this.prisma.releaseMedia.count({
        where: {
          AND: [{ releaseId: dto.releaseId }, { userId: dto.userId }],
        },
      });

      if (existByUserRelease) {
        throw new ConflictException(
          'Вы уже оставляли медиарецензию на данный релиз!',
        );
      }

      const review = await this.reviewsService.findByUserReleaseIds(
        dto.userId,
        dto.releaseId,
      );

      reviewId = review.id;

      if (!review) {
        throw new BadRequestException(
          'Чтобы добавить медиарецензию требуется оставить оценку/рецензию к релизу!',
        );
      }
    }

    if (await this.checkExistenceByUrl(dto.url)) {
      throw new ConflictException('Медиарецензия с таким URL уже существует!');
    }

    const created = await this.prisma.releaseMedia.create({
      data: {
        ...dto,
        reviewId: reviewId,
      },
      include: {
        releaseMediaStatus: true,
        releaseMediaType: true,
        user: {
          select: {
            id: true,
            nickname: true,
            profile: { select: { avatar: true, points: true } },
            topUsersLeaderboard: { select: { rank: true } },
          },
        },
        release: {
          select: {
            id: true,
            title: true,
            img: true,
            releaseProducer: { select: { authorId: true } },
            releaseArtist: { select: { authorId: true } },
            releaseDesigner: { select: { authorId: true } },
          },
        },
        userFavMedia: {
          select: {
            userId: true,
            mediaId: true,
            user: {
              select: {
                id: true,
                nickname: true,
                profile: { select: { avatar: true } },
                registeredAuthor: { select: { authorId: true } },
              },
            },
          },
        },
        review: {
          select: {
            total: true,
            rhymes: true,
            structure: true,
            realization: true,
            individuality: true,
            atmosphere: true,
          },
        },
      },
    });

    return plainToInstance(ReleaseMediaResponseDto, created, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(
    query: ReleaseMediaRequestQuery,
  ): Promise<ReleaseMediaListResponseDto> {
    const {
      limit,
      offset,
      statusId,
      typeId,
      releaseId,
      userId,
      order,
      query: searchTerm,
    } = query;

    const where: Prisma.ReleaseMediaWhereInput = {};

    if (statusId) {
      await this.releaseMediaStatusesService.findById(statusId);
      where.releaseMediaStatusId = statusId;
    }

    if (typeId) {
      await this.releaseMediaTypesService.findById(typeId);
      where.releaseMediaTypeId = typeId;
    }

    if (releaseId) {
      await this.releasesService.findOne(releaseId);
      where.releaseId = releaseId;
    }

    if (userId) {
      await this.usersService.findOne(userId);
      where.userId = userId;
    }

    if (searchTerm) {
      where.OR = [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          url: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          user: {
            nickname: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          release: {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const [count, items] = await Promise.all([
      this.prisma.releaseMedia.count({ where }),
      this.prisma.releaseMedia.findMany({
        where,
        orderBy: [
          {
            createdAt: order ?? 'desc',
          },
          { id: 'desc' },
        ],
        take: limit,
        skip: offset,
        include: {
          releaseMediaStatus: true,
          releaseMediaType: true,
          user: {
            select: {
              id: true,
              nickname: true,
              profile: { select: { avatar: true, points: true } },
              topUsersLeaderboard: { select: { rank: true } },
            },
          },
          release: {
            select: {
              id: true,
              title: true,
              img: true,
              releaseProducer: { select: { authorId: true } },
              releaseArtist: { select: { authorId: true } },
              releaseDesigner: { select: { authorId: true } },
            },
          },
          userFavMedia: {
            select: {
              userId: true,
              mediaId: true,
              user: {
                select: {
                  id: true,
                  nickname: true,
                  profile: { select: { avatar: true } },
                  registeredAuthor: { select: { authorId: true } },
                },
              },
            },
          },
          review: {
            select: {
              total: true,
              rhymes: true,
              structure: true,
              realization: true,
              individuality: true,
              atmosphere: true,
            },
          },
        },
      }),
    ]);

    return {
      count,
      releaseMedia: plainToInstance(ReleaseMediaResponseDto, items, {
        excludeExtraneousValues: true,
      }),
    };
  }

  async findOne(
    releaseId: string,
    userId: string,
  ): Promise<ReleaseMediaResponseDto> {
    const releaseMedia = await this.prisma.releaseMedia.findUnique({
      where: { releaseId_userId: { releaseId, userId } },
      include: {
        releaseMediaStatus: true,
        releaseMediaType: true,
        user: {
          select: {
            id: true,
            nickname: true,
            profile: { select: { avatar: true, points: true } },
            topUsersLeaderboard: { select: { rank: true } },
          },
        },
        release: {
          select: {
            id: true,
            title: true,
            img: true,
            releaseProducer: { select: { authorId: true } },
            releaseArtist: { select: { authorId: true } },
            releaseDesigner: { select: { authorId: true } },
          },
        },
        userFavMedia: {
          select: {
            userId: true,
            mediaId: true,
            user: {
              select: {
                id: true,
                nickname: true,
                profile: { select: { avatar: true } },
                registeredAuthor: { select: { authorId: true } },
              },
            },
          },
        },
        review: {
          select: {
            total: true,
            rhymes: true,
            structure: true,
            realization: true,
            individuality: true,
            atmosphere: true,
          },
        },
      },
    });

    if (!releaseMedia) {
      throw new EntityNotFoundException(
        'Медиа',
        'releaseId_userId',
        `${releaseId}_${userId}`,
      );
    }

    return plainToInstance(ReleaseMediaResponseDto, releaseMedia, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    dto: UpdateReleaseMediaDto,
    userId?: string,
  ): Promise<ReleaseMediaResponseDto> {
    if (!dto || Object.keys(dto).length === 0) {
      throw new NoDataProvidedException();
    }
    const releaseMedia = await this.findById(id);

    if (dto.releaseId) {
      await this.releasesService.findOne(dto.releaseId);
    }

    if (dto.releaseMediaTypeId) {
      await this.releaseMediaTypesService.findById(dto.releaseMediaTypeId);
    }

    let newStatusId: string | undefined = dto.releaseMediaStatusId;

    if (newStatusId) {
      await this.releaseMediaStatusesService.findById(newStatusId);
    }

    if (userId) {
      if (releaseMedia.userId !== userId) {
        throw new InsufficientPermissionsException();
      }

      const newStatus = await this.releaseMediaStatusesService.findByStatus(
        ReleaseMediaStatusesEnum.PENDING,
      );

      newStatusId = newStatus.id;
    }

    if (dto.url) {
      if (await this.checkExistenceByUrl(dto.url)) {
        throw new ConflictException(
          'Медиарецензия с таким URL уже существует!',
        );
      }
    }

    const updated = await this.prisma.releaseMedia.update({
      where: { id },
      data: {
        ...dto,
        releaseMediaStatusId: newStatusId,
      },
      include: {
        releaseMediaStatus: true,
        releaseMediaType: true,
        user: {
          select: {
            id: true,
            nickname: true,
            profile: { select: { avatar: true, points: true } },
            topUsersLeaderboard: { select: { rank: true } },
          },
        },
        release: {
          select: {
            id: true,
            title: true,
            img: true,
            releaseProducer: { select: { authorId: true } },
            releaseArtist: { select: { authorId: true } },
            releaseDesigner: { select: { authorId: true } },
          },
        },
        userFavMedia: {
          select: {
            userId: true,
            mediaId: true,
            user: {
              select: {
                id: true,
                nickname: true,
                profile: { select: { avatar: true } },
                registeredAuthor: { select: { authorId: true } },
              },
            },
          },
        },
        review: {
          select: {
            total: true,
            rhymes: true,
            structure: true,
            realization: true,
            individuality: true,
            atmosphere: true,
          },
        },
      },
    });

    return plainToInstance(ReleaseMediaResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string, userId?: string) {
    const releaseMedia = await this.findById(id);

    if (userId) {
      if (releaseMedia.userId !== userId) {
        throw new InsufficientPermissionsException();
      }
    }

    return this.prisma.releaseMedia.delete({ where: { id } });
  }

  private async checkExistenceByUrl(url: string): Promise<boolean> {
    const count = await this.prisma.releaseMedia.count({
      where: {
        url: { equals: url, mode: 'insensitive' },
      },
    });
    return count > 0;
  }

  async findById(id: string) {
    const result = await this.prisma.releaseMedia.findUnique({
      where: { id },
      include: {
        releaseMediaStatus: true,
        releaseMediaType: true,
      },
    });

    if (!result) {
      throw new EntityNotFoundException('Медиа', 'id', id);
    }

    return result;
  }
}
