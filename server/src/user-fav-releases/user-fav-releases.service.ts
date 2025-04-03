import { Injectable } from '@nestjs/common';
import { UserFavRelease } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { DuplicateFieldException } from 'src/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from 'src/exceptions/entity-not-found.exception';
import { ReleasesService } from 'src/releases/releases.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserFavReleaseDto } from './dto/create-user-fav-release.dto';
import { DeleteUserFavReleaseDto } from './dto/delete-user-fav-release.dto';

@Injectable()
export class UserFavReleasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly releasesService: ReleasesService,
  ) {}

  async create(
    createUserFavReleaseDto: CreateUserFavReleaseDto,
    userId: string,
  ): Promise<UserFavRelease> {
    const { releaseId } = createUserFavReleaseDto;

    await this.usersService.findOne(userId);
    await this.releasesService.findOne(releaseId);

    const existing = await this.findOne(userId, releaseId);
    if (existing) {
      throw new DuplicateFieldException(
        `Пользователь с id '${userId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }

    return this.prisma.userFavRelease.create({
      data: { ...createUserFavReleaseDto, userId },
    });
  }

  async findAll(): Promise<UserFavRelease[]> {
    return this.prisma.userFavRelease.findMany();
  }

  async findByUserId(userId: string): Promise<UserFavRelease[]> {
    const result = await this.prisma.userFavRelease.findMany({
      where: { userId },
    });

    if (result.length === 0) {
      throw new EntityNotFoundException(
        'Понравившиеся релизы',
        'id пользователя',
        `${userId}`,
      );
    }
    return result;
  }

  async findByReleaseId(releaseId: string): Promise<UserFavRelease[]> {
    const result = await this.prisma.userFavRelease.findMany({
      where: { releaseId },
    });

    if (result.length === 0) {
      throw new EntityNotFoundException(
        'Пользователи, которорым понравилась релиз',
        'id',
        `${releaseId}`,
      );
    }
    return result;
  }

  async remove(
    deleteUserFavReleaseDto: DeleteUserFavReleaseDto,
    userId: string,
  ): Promise<UserFavRelease> {
    const { releaseId } = deleteUserFavReleaseDto;

    const existing = await this.findOne(userId, releaseId);
    if (!existing) {
      throw new EntityNotFoundException(
        `Пользователь с id '${userId}' и`,
        'id релиза',
        `${releaseId}`,
      );
    }

    return this.prisma.userFavRelease.delete({
      where: { userId_releaseId: { ...deleteUserFavReleaseDto, userId } },
    });
  }

  private async findOne(
    userId: string,
    releaseId: string,
  ): Promise<UserFavRelease | null> {
    return this.prisma.userFavRelease.findUnique({
      where: { userId_releaseId: { userId, releaseId } },
    });
  }
}
