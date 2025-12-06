import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that authenticates JWT tokens and ensures user is active.
 *
 * Extends NestJS AuthGuard with the 'jwt' strategy, requiring both
 * valid token and active user status. Used for protected endpoints
 * that require authenticated and activated users.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
