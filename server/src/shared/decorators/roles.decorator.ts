import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../../roles/types/user-role.enum';

/**
 * Decorator that sets role metadata for authorization.
 *
 * Uses NestJS `SetMetadata` to attach an array of allowed roles to a
 * controller method or class. This metadata is typically used by guards
 * to enforce role-based access control.
 *
 * @param roles - Array of UserRoleEnum values representing allowed roles.
 * @returns A decorator function that sets the 'roles' metadata.
 */
export const Roles = (...roles: UserRoleEnum[]) => SetMetadata('roles', roles);
