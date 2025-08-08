import { Exclude, Expose, Transform } from 'class-transformer';
import { formatFullDate } from '../../../shared/utils/format-full-date';

interface UserProfileResponseObject {
  profile?: { avatar: string };
}

interface UsersResponseObject {
  role: { role: string };
  profile?: { avatar: string };
}

export class FindUsersResponseDto {
  @Expose()
  total: number;

  @Expose()
  users: FindUsersPrismaResponseDto[];
}

export class FindUsersPrismaResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Transform(({ value }) => formatFullDate(value as Date))
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
