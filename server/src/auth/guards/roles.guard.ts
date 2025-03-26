import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InsufficientPermissionsException } from '../../exceptions/insufficient-permissions.exception';
import { UserRoleEnum } from '../../roles/types/user-role.enum';
import { IAuthenticatedRequest } from '../types/authenticated-request.interface';
import { JwtAuthGuard } from './jwt-auth.guard';

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
