import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateAuthorConfirmationDto } from './dto/create-author-confirmation.dto';
import { FindAuthorConfirmationsByUserIdResponseDto } from './dto/response/find-author-confirmations-by-user-id.response.dto';

@Injectable()
export class AuthorConfirmationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  create(data: CreateAuthorConfirmationDto[]) {
    return this.prisma.authorConfirmation.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findByUserId(
    userId: string,
  ): Promise<FindAuthorConfirmationsByUserIdResponseDto[]> {
    await this.usersService.findOne(userId);
    const result = await this.prisma.authorConfirmation.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, nickname: true } },
        author: { select: { id: true, name: true } },
        status: true,
      },
    });

    return plainToInstance(FindAuthorConfirmationsByUserIdResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
