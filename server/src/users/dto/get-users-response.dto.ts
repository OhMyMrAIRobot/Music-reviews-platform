import { Exclude, Expose, Transform } from 'class-transformer';
import { formatUserCreatedAt } from '../utils/format-user-created-at';

interface UserProfileResponseObject {
  profile?: { avatar: string };
}

interface UsersResponseObject {
  role: { role: string };
  profile?: { avatar: string };
}

export class GetUsersResponseDto {
  @Expose()
  total: number;

  @Expose()
  users: GetUsersPrismaResponseDto[];
}

export class GetUsersPrismaResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Transform(({ value }) => formatUserCreatedAt(value as Date))
  createdAt: string;

  @Expose()
  @Transform(({ obj }: { obj: UsersResponseObject }) => obj.role.role)
  role: string;

  @Expose()
  @Transform(
    ({ obj }: { obj: UsersResponseObject }) => obj.profile?.avatar ?? '',
  )
  avatar: string;

  @Exclude()
  password: string;

  @Exclude()
  roleId: string;

  @Exclude()
  profile?: UserProfileResponseObject;
}
