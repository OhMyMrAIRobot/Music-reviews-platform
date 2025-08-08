import { Expose, Transform, Type } from 'class-transformer';

class AuthorType {
  id: string;
  type: string;
}

class AuthorTypes {
  authorType: AuthorType;
  authorTypeId: string;
  authorId: string;
}

export class AdminFindAuthorsResponseDto {
  @Expose()
  total: number;

  @Expose()
  @Type(() => AdminAuthorDto)
  authors: AdminAuthorDto[];
}

export class AdminAuthorDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  avatarImg: string;

  @Expose()
  coverImg: string;

  @Expose()
  @Transform(
    ({ value }: { value: AuthorTypes[] }) =>
      value?.map((item) => item.authorType) || [],
  )
  @Type(() => AuthorTypeDto)
  types: AuthorTypeDto[];
}

export class AuthorTypeDto {
  @Expose()
  id: string;

  @Expose()
  type: string;
}
