import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorConfirmationStatusesService } from 'src/author-confirmation-statuses/author-confirmation-statuses.service';
import { AuthorConfirmationStatusesEnum } from 'src/author-confirmation-statuses/types/author-confirmation-statuses.enum';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { UsersService } from 'src/users/users.service';
import { CreateAuthorConfirmationDto } from './dto/create-author-confirmation.dto';
import { AuthorConfirmationsQueryDto } from './dto/query/author-confirmations.query.dto';
import { UpdateAuthorConfirmationRequestDto } from './dto/request/update-author-confirmation.request.dto';
import { AuthorConfirmationDto } from './dto/response/author-confirmation.dto';
import { AuthorConfirmationsResponseDto } from './dto/response/author-confirmations.response.dto';

@Injectable()
export class AuthorConfirmationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly authorConfirmationStatusesService: AuthorConfirmationStatusesService,
  ) {}

  /**
   * Create multiple author confirmation records in bulk.
   *
   * Uses `createMany` with `skipDuplicates` so repeated submissions for the
   * same user/author pair are ignored. Returns the Prisma createMany result.
   */
  create(data: CreateAuthorConfirmationDto[]) {
    return this.prisma.authorConfirmation.createMany({
      data,
      skipDuplicates: true,
    });
  }

  /**
   * Find confirmations matching the provided query.
   *
   * Supports filtering by `userId`, `statusId`, free-text `search` across
   * author name and user nickname, ordering and pagination. Validates
   * referenced status existence when `statusId` is provided.
   */
  async findAll(
    query: AuthorConfirmationsQueryDto,
  ): Promise<AuthorConfirmationsResponseDto> {
    const {
      limit,
      offset = 0,
      search: searchQuery,
      statusId,
      order = 'desc',
      userId,
    } = query;

    if (statusId) {
      await this.authorConfirmationStatusesService.findOne(statusId);
    }

    const where: Prisma.AuthorConfirmationWhereInput = {
      AND: [
        userId ? { userId } : {},
        statusId ? { statusId } : {},
        searchQuery
          ? {
              OR: [
                {
                  author: {
                    name: {
                      contains: searchQuery,
                      mode: 'insensitive',
                    },
                  },
                },
                {
                  user: {
                    nickname: {
                      contains: searchQuery,
                      mode: 'insensitive',
                    },
                  },
                },
              ],
            }
          : {},
      ],
    };

    const [count, result] = await Promise.all([
      this.prisma.authorConfirmation.count({ where }),
      this.prisma.authorConfirmation.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          user: { select: { id: true, nickname: true, profile: true } },
          author: { select: { id: true, name: true, avatarImg: true } },
          status: true,
        },
        orderBy: [{ createdAt: order }, { id: 'desc' }],
      }),
    ]);

    return {
      meta: { count },
      items: plainToInstance(AuthorConfirmationDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  /**
   * Update the status of a confirmation.
   *
   * Preconditions:
   * - The confirmation must exist.
   * - The current status must be `PENDING` (otherwise update is blocked).
   *
   * Side effects:
   * - When the new status is `APPROVED`, a `registeredAuthor` record is
   *   created linking the user and the author.
   * - When the new status is `PENDING` or `REJECTED`, the `registeredAuthor`
   *   record is deleted if it exists.
   *
   * Returns the updated `AuthorConfirmationDto`.
   */
  async update(
    id: string,
    dto: UpdateAuthorConfirmationRequestDto,
  ): Promise<AuthorConfirmationDto> {
    const exist = await this.findOne(id);
    const newStatus = await this.authorConfirmationStatusesService.findOne(
      dto.statusId,
    );

    const result = await this.prisma.$transaction(async (prisma) => {
      const newStatusEnum = newStatus.status as AuthorConfirmationStatusesEnum;

      if (newStatusEnum === AuthorConfirmationStatusesEnum.APPROVED) {
        await prisma.registeredAuthor.create({
          data: {
            authorId: exist.authorId,
            userId: exist.userId,
          },
        });
      } else if (
        newStatusEnum === AuthorConfirmationStatusesEnum.PENDING ||
        newStatusEnum === AuthorConfirmationStatusesEnum.REJECTED
      ) {
        await prisma.registeredAuthor.deleteMany({
          where: {
            authorId: exist.authorId,
            userId: exist.userId,
          },
        });
      }

      return await prisma.authorConfirmation.update({
        where: { id },
        data: dto,
        include: {
          user: { select: { id: true, nickname: true, profile: true } },
          author: { select: { id: true, name: true, avatarImg: true } },
          status: true,
        },
      });
    });

    return plainToInstance(AuthorConfirmationDto, result, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Delete a confirmation by id.
   *
   * Also deletes the associated `registeredAuthor` record if it exists,
   * ensuring cleanup of all related data.
   *
   * Ensures the entity exists before performing deletion.
   */
  async delete(id: string) {
    const exist = await this.findOne(id);

    await this.prisma.$transaction(async (prisma) => {
      await prisma.registeredAuthor.deleteMany({
        where: {
          authorId: exist.authorId,
          userId: exist.userId,
        },
      });

      await prisma.authorConfirmation.delete({
        where: { id },
      });
    });

    return;
  }

  /**
   * Internal helper to fetch a confirmation by id including its status.
   *
   * Throws `EntityNotFoundException` when the confirmation does not exist.
   */
  private async findOne(id: string) {
    const exist = await this.prisma.authorConfirmation.findUnique({
      where: { id },
      include: { status: true },
    });

    if (!exist) {
      throw new EntityNotFoundException('Заявка на верификацию', 'id', id);
    }

    return exist;
  }
}
