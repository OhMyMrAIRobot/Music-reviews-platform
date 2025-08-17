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

  async findByUserId(userId: string): Promise<RegisteredAuthor[]> {
    await this.usersService.findOne(userId);

    return this.prisma.registeredAuthor.findMany({
      where: { userId },
    });
  }

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
}
