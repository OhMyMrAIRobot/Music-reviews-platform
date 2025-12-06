import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IAuthenticatedRequest } from '../../auth/types/authenticated-request.interface';
import { UserRoleEnum } from '../../roles/types/user-role.enum';
import { InsufficientPermissionsException } from '../exceptions/insufficient-permissions.exception';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * Guard that enforces role-based access control on protected routes.
 *
 * Extends JwtAuthGuard to first authenticate the user, then checks if
 * the user's role matches any of the required roles set via the @Roles
 * decorator. Throws InsufficientPermissionsException if roles don't match.
 */
@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  /**
   * Creates a new RolesGuard instance.
   *
   * @param reflector - NestJS Reflector for reading metadata from handlers
   */
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Checks if the current user has the required roles for the route.
   *
   * First calls parent canActivate for JWT authentication, then retrieves
   * required roles from metadata and validates user permissions.
   *
   * @param context - Execution context containing request details
   * @returns true if user has required roles, throws exception otherwise
   * @throws UnauthorizedException if no authenticated user
   * @throws InsufficientPermissionsException if user lacks required role
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRoleEnum[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const user = context
      .switchToHttp()
      .getRequest<IAuthenticatedRequest>().user;
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!requiredRoles.includes(user.role)) {
      throw new InsufficientPermissionsException();
    }

    return true;
  }
}
