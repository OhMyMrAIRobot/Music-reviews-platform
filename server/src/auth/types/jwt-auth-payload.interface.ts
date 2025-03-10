import { UserRoleEnum } from '../../roles/types/user-role.enum';

export interface IJwtAuthPayload {
  id: string;
  email: string;
  nickname: string;
  role: UserRoleEnum;
  isActive: boolean;
}
