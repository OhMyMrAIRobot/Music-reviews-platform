import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { formatFullDate } from 'src/shared/utils/format-full-date';

type UserProfileLite = { avatar: string };
type UserLite = {
  id: string;
  nickname: string;
  profile?: UserProfileLite | null;
};

class Status {
  @Expose()
  id: string;

  @Expose()
  status: string;
}

class Author {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  avatarImg: string;
}

class User {
  @Expose()
  id: string;

  @Expose()
  nickname: string;

  @Expose()
  @Transform(({ obj }: { obj: UserLite }) => obj.profile?.avatar ?? '')
  avatar: string;
}

export class AuthorConfirmationResponseDto {
  @Expose()
  id: string;

  @Expose()
  confirmation: string;

  @Expose()
  @Transform(({ value }) => formatFullDate(value as Date))
  createdAt: string;

  @Expose()
  @Type(() => User)
  user: User;

  @Expose()
  @Type(() => Author)
  author: Author;

  @Expose()
  @Type(() => Status)
  status: Status;

  @Exclude()
  userId: string;

  @Exclude()
  authorId: string;

  @Exclude()
  statusId: string;
}
