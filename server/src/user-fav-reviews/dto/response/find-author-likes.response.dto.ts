import { Expose, Type } from 'class-transformer';

class SimpleUserDto {
  @Expose()
  id: string;

  @Expose()
  nickname: string;

  @Expose()
  avatar: string;
}

class SimpleReleaseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  img: string;
}

export class AuthorLikeItemDto {
  @Expose()
  @Type(() => SimpleUserDto)
  reviewAuthor: SimpleUserDto;

  @Expose()
  @Type(() => SimpleUserDto)
  author: SimpleUserDto;

  @Expose()
  @Type(() => SimpleReleaseDto)
  release: SimpleReleaseDto;

  @Expose()
  reviewTitle: string;
}

export class FindAuthorLikesResponseDto {
  @Expose()
  count: number;

  @Expose()
  @Type(() => AuthorLikeItemDto)
  items: AuthorLikeItemDto[] = [];
}
