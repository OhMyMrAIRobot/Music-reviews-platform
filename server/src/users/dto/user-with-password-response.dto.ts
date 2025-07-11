import { Exclude, Expose, Type } from 'class-transformer';

export class UserWithPasswordResponseDto {
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

  @Expose()
  password: string;

  @Expose()
  @Type(() => Object)
  role: {
    id: string;
    role: string;
  };
}
