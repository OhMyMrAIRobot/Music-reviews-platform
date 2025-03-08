import { Expose } from 'class-transformer';

export class UserWithPasswordResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  isActive: boolean;

  @Expose()
  roleId: string;

  @Expose()
  password: string;
}
