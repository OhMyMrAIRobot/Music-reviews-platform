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

  /**
   * Add a release to user's favorites.
   *
   * Validates that both user and release exist, ensures the favorite
   * doesn't already exist, then creates the association.
   *
   * @param releaseId - id of the release to favorite
   * @param userId - id of the user adding the favorite
   * @returns created UserFavRelease record
   * @throws ConflictException when the release is already favorited
   */
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

  /**
   * Retrieve all favorite releases for a specific user.
   *
   * Validates that the user exists before fetching their favorites.
   *
   * @param userId - id of the user whose favorites to retrieve
   * @returns array of UserFavRelease records
   */
  async findByUserId(userId: string): Promise<UserFavRelease[]> {
    await this.usersService.findOne(userId);

    return this.prisma.userFavRelease.findMany({
      where: { userId },
    });
  }

  /**
   * Retrieve all users who favorited a specific release.
   *
   * Validates that the release exists before fetching favorites.
   *
   * @param releaseId - id of the release to get favorites for
   * @returns array of UserFavRelease records
   */
  async findByReleaseId(releaseId: string): Promise<UserFavRelease[]> {
    await this.releasesService.findOne(releaseId);

    return this.prisma.userFavRelease.findMany({
      where: { releaseId },
    });
  }

  /**
   * Remove a release from user's favorites.
   *
   * Validates that both user and release exist, ensures the favorite
   * exists, then removes the association.
   *
   * @param releaseId - id of the release to unfavorite
   * @param userId - id of the user removing the favorite
   * @returns deleted UserFavRelease record
   * @throws ConflictException when the release was not favorited
   */
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

  /**
   * Check if a specific user-release favorite relationship exists.
   *
   * Internal helper used to prevent duplicates and validate removals.
   *
   * @param userId - id of the user
   * @param releaseId - id of the release
   * @returns UserFavRelease record if exists, null otherwise
   */
  async findOne(
    userId: string,
    releaseId: string,
  ): Promise<UserFavRelease | null> {
    return this.prisma.userFavRelease.findUnique({
      where: { userId_releaseId: { userId, releaseId } },
    });
  }
}
