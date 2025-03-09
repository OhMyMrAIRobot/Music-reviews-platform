import { UserRoleEnum } from '../../roles/types/user-role.enum';

export interface IJwtAuthPayload {
  id: string;
  email: string;
  role: UserRoleEnum;
  isActive: boolean;
}
