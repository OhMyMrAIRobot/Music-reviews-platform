import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegisteredAuthor } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ReleasesService } from 'src/releases/releases.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RegisteredAuthorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly releasesService: ReleasesService,
  ) {}
  /**
   * Verify that the given user is registered as an author and is an author
   * of the specified release.
   *
   * Steps:
   * - ensure the user has at least one registered author entry
   * - load the target release and check whether any of the user's
   *   registered author ids participate in the release (artist/producer/designer)
   *
   * @param userId - id of the user to check
   * @param releaseId - id of the release to verify authorship against
   * @throws BadRequestException when the user is not registered as an author
   * @throws ForbiddenException when the user is not an author of the release
   */
  async checkUserIsReleaseAuthor(userId: string, releaseId: string) {
    const userAuthors = await this.findByUserId(userId);

    if (userAuthors.length === 0) {
      throw new BadRequestException(
        `Пользователь с ID '${userId}' не зарегистрирован как автор`,
      );
    }

    const userAuthorIds = userAuthors.map((u) => u.authorId);

    const release = await this.releasesService.findOne(releaseId);

    const isUserAuthor =
      release.releaseArtist.some((ra) => userAuthorIds.includes(ra.authorId)) ||
      release.releaseProducer.some((rp) =>
        userAuthorIds.includes(rp.authorId),
      ) ||
      release.releaseDesigner.some((rd) => userAuthorIds.includes(rd.authorId));

    if (!isUserAuthor) {
      throw new ForbiddenException(
        `Пользователь не является автором релиза ${releaseId}`,
      );
    }

    return;
  }

  /**
   * Return all `RegisteredAuthor` rows for a given user.
   *
   * Ensures the user exists first via `UsersService.findOne` and then
   * queries the `registeredAuthor` table.
   *
   * @param userId - target user id
   * @returns array of `RegisteredAuthor` records belonging to the user
   */
  private async findByUserId(userId: string): Promise<RegisteredAuthor[]> {
    await this.usersService.findOne(userId);

    return this.prisma.registeredAuthor.findMany({
      where: { userId },
    });
  }
}
