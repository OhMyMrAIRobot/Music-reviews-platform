import { Exclude, Expose, Transform } from 'class-transformer';

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
  @Transform(({ value }) => formatDate(value as Date))
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

function formatDate(date: Date): string {
  if (!date) return '';

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
