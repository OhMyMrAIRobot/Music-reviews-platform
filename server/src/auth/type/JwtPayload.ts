import { UserRole } from '../../roles/type/userRole';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}
