import { Exclude, Expose, Type } from 'class-transformer';

class RegisteredAuthorDto {
  @Exclude()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  authorId: string;

  @Exclude()
  createdAt: string;
}

class UserRoleDto {
  @Expose()
  id: string;

  @Expose()
  role: string;
}

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  isActive: boolean;

  @Exclude()
  roleId: string;

  @Expose()
  createdAt: Date;

  @Exclude()
  password: string;

  @Expose()
  @Type(() => UserRoleDto)
  role: UserRoleDto;

  @Expose()
  @Type(() => RegisteredAuthorDto)
  registeredAuthor: RegisteredAuthorDto[];
}
