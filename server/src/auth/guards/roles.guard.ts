import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRoleEnum } from '../../roles/types/user-role.enum';
import { IAuthenticatedRequest } from '../types/authenticated-request.interface';
import { InsufficientPermissionsException } from '../../exceptions/insufficient-permissions.exception';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

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
