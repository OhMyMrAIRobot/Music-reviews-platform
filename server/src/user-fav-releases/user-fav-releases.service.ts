import { ConflictException, Injectable } from '@nestjs/common';
import { UserFavRelease } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ReleasesService } from 'src/releases/releases.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserFavReleasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly releasesService: ReleasesService,
  ) {}

  async create(releaseId: string, userId: string): Promise<UserFavRelease> {
    await this.usersService.findOne(userId);
    await this.releasesService.findOne(releaseId);

    const existing = await this.findOne(userId, releaseId);
    if (existing) {
      throw new ConflictException(
        'Вы уже отметили данный релиз как понравившийся!',
      );
    }

    return this.prisma.userFavRelease.create({
      data: { releaseId, userId },
    });
  }

  async findByUserId(userId: string): Promise<UserFavRelease[]> {
    await this.usersService.findOne(userId);

    return this.prisma.userFavRelease.findMany({
      where: { userId },
    });
  }

  async findByReleaseId(releaseId: string): Promise<UserFavRelease[]> {
    await this.releasesService.findOne(releaseId);

    return this.prisma.userFavRelease.findMany({
      where: { releaseId },
    });
  }

  async remove(releaseId: string, userId: string): Promise<UserFavRelease> {
    await this.releasesService.findOne(releaseId);
    await this.usersService.findOne(userId);

    const existing = await this.findOne(userId, releaseId);
    if (!existing) {
      throw new ConflictException(
        'Вы не отмечали данный релиз как понравившийся!',
      );
    }

    return this.prisma.userFavRelease.delete({
      where: { userId_releaseId: { userId, releaseId } },
    });
  }

  async findOne(
    userId: string,
    releaseId: string,
  ): Promise<UserFavRelease | null> {
    return this.prisma.userFavRelease.findUnique({
      where: { userId_releaseId: { userId, releaseId } },
    });
  }
}
