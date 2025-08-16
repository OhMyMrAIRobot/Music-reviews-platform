import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorConfirmationStatusesService } from 'src/author-confirmation-statuses/author-confirmation-statuses.service';
import { UsersService } from 'src/users/users.service';
import { CreateAuthorConfirmationDto } from './dto/create-author-confirmation.dto';
import { FindAuthorConfirmationsQuery } from './dto/query/find-author-confirmations-query.dto';
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
        user: { select: { id: true, nickname: true } },
        author: { select: { id: true, name: true } },
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
    const { limit, offset = 0, query: searchQuery, statusId } = query;

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
          user: { select: { id: true, nickname: true } },
          author: { select: { id: true, name: true } },
          status: true,
        },
      }),
    ]);

    return {
      count,
      items: plainToInstance(AuthorConfirmationResponseDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
