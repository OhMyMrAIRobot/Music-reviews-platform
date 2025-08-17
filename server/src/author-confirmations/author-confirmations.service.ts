import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorConfirmationStatusesService } from 'src/author-confirmation-statuses/author-confirmation-statuses.service';
import { AuthorConfirmationStatusesEnum } from 'src/author-confirmation-statuses/types/author-confirmation-statuses.enum';
import { EntityNotFoundException } from 'src/shared/exceptions/entity-not-found.exception';
import { UsersService } from 'src/users/users.service';
import { CreateAuthorConfirmationDto } from './dto/create-author-confirmation.dto';
import { FindAuthorConfirmationsQuery } from './dto/query/find-author-confirmations-query.dto';
import { UpdateAuthorConfirmationRequestDto } from './dto/request/update-author-confirmation.request.dto';
import { AuthorConfirmationResponseDto } from './dto/response/author-confirmation.response.dto';
import { FindAuthorConfirmationResponseDto } from './dto/response/find-author-confirmations.response.dto';

@Injectable()
export class AuthorConfirmationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly authorConfirmationStatusesService: AuthorConfirmationStatusesService,
  ) {}

  create(data: CreateAuthorConfirmationDto[]) {
    return this.prisma.authorConfirmation.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findByUserId(userId: string): Promise<AuthorConfirmationResponseDto[]> {
    await this.usersService.findOne(userId);
    const result = await this.prisma.authorConfirmation.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, nickname: true, profile: true } },
        author: { select: { id: true, name: true, avatarImg: true } },
        status: true,
      },
    });

    return plainToInstance(AuthorConfirmationResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(
    query: FindAuthorConfirmationsQuery,
  ): Promise<FindAuthorConfirmationResponseDto> {
    const {
      limit,
      offset = 0,
      query: searchQuery,
      statusId,
      order = 'desc',
    } = query;

    if (statusId) {
      await this.authorConfirmationStatusesService.findOne(statusId);
    }

    const where: Prisma.AuthorConfirmationWhereInput = {
      AND: [
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
      count,
      items: plainToInstance(AuthorConfirmationResponseDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  async update(
    id: string,
    dto: UpdateAuthorConfirmationRequestDto,
  ): Promise<AuthorConfirmationResponseDto> {
    const exist = await this.findOne(id);
    const newStatus = await this.authorConfirmationStatusesService.findOne(
      dto.statusId,
    );

    if (
      (exist.status.status as AuthorConfirmationStatusesEnum) !==
      AuthorConfirmationStatusesEnum.PENDING
    ) {
      throw new BadRequestException(
        'Вы не можете изменить статус принятой / отклонённой заявки!',
      );
    }

    const result = await this.prisma.$transaction(async (prisma) => {
      if (
        (newStatus.status as AuthorConfirmationStatusesEnum) ===
        AuthorConfirmationStatusesEnum.APPROVED
      ) {
        await prisma.registeredAuthor.create({
          data: {
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

    return plainToInstance(AuthorConfirmationResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    return this.prisma.authorConfirmation.delete({
      where: { id },
    });
  }

  async findOne(id: string) {
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
