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
