import { Exclude, Expose, Type } from 'class-transformer';

export class FindAuthorsResponseDto {
  @Expose()
  total: number;

  @Expose()
  @Type(() => AuthorDto)
  authors: AuthorDto[];
}

export class AuthorDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  avatarImg: string;

  @Exclude()
  coverImg: string;

  @Expose()
  @Type(() => AuthorTypeDto)
  types: AuthorTypeDto[];
}

export class AuthorTypeDto {
  @Expose()
  id: string;

  @Expose()
  type: string;
}
