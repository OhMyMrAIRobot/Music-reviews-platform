import { UserRole } from '../../roles/type/userRole';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
