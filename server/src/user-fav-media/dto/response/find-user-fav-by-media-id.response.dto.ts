import { UserFavMedia } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';

type ReleaseAuthorLink = { authorId: string };
type ReleaseWithAuthors = {
  release?: {
    releaseProducer?: ReleaseAuthorLink[];
    releaseArtist?: ReleaseAuthorLink[];
    releaseDesigner?: ReleaseAuthorLink[];
  } | null;
};

type RegisteredAuthorLink = { authorId: string };
type UserProfileLite = { avatar: string | null };
type UserLite = {
  id: string;
  nickname: string;
  profile?: UserProfileLite | null;
  registeredAuthor?: RegisteredAuthorLink[] | null;
} | null;

type UserFavMediaRaw = {
  userId: string;
  mediaId: string;
  user?: UserLite;
};

type WithUserFavMedia = {
  userFavMedia?: UserFavMediaRaw[] | null;
};

class AuthorFavMedia {
  @Expose()
  userId: string;

  @Expose()
  avatar: string;

  @Expose()
  nickname: string;

  @Expose()
  mediaId: string;
}

export class FindUserFavByMediaIdResponseDto {
  @Expose()
  userFavMedia: UserFavMedia[] = [];

  @Expose()
  @Type(() => AuthorFavMedia)
  @Transform(({ obj }: { obj: WithUserFavMedia & ReleaseWithAuthors }) => {
    const producers: ReleaseAuthorLink[] = obj.release?.releaseProducer ?? [];
    const artists: ReleaseAuthorLink[] = obj.release?.releaseArtist ?? [];
    const designers: ReleaseAuthorLink[] = obj.release?.releaseDesigner ?? [];

    const releaseAuthorIds: Set<string> = new Set<string>([
      ...producers.map((x: ReleaseAuthorLink) => x.authorId),
      ...artists.map((x: ReleaseAuthorLink) => x.authorId),
      ...designers.map((x: ReleaseAuthorLink) => x.authorId),
    ]);

    const favs: UserFavMediaRaw[] = obj.userFavMedia ?? [];
    const seenUsers: Set<string> = new Set<string>();
    const result: AuthorFavMedia[] = [];

    for (const fav of favs) {
      const likerUserId: string = fav.userId;
      if (seenUsers.has(likerUserId)) continue;

      const user: UserLite = fav.user ?? null;
      const userAuthors: RegisteredAuthorLink[] = user?.registeredAuthor ?? [];

      const isAuthorOfThisRelease: boolean = userAuthors.some(
        (ra: RegisteredAuthorLink) => releaseAuthorIds.has(ra.authorId),
      );
      if (!isAuthorOfThisRelease) continue;

      result.push({
        userId: likerUserId,
        mediaId: fav.mediaId,
        nickname: user?.nickname ?? '',
        avatar: user?.profile?.avatar ?? '',
      });

      seenUsers.add(likerUserId);
    }

    return result;
  })
  authorFavMedia: AuthorFavMedia[] = [];
}
