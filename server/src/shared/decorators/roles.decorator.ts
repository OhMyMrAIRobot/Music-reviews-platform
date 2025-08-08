import { UserRoleEnum } from '../../roles/types/user-role.enum';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserRoleEnum[]) => SetMetadata('roles', roles);
