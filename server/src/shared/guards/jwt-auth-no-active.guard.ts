import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that authenticates JWT tokens without checking user activation status.
 *
 * Extends NestJS AuthGuard with the 'jwt-no-active' strategy, allowing
 * authentication for both active and inactive users. Useful for endpoints
 * like resending activation emails where inactive users need access.
 */
@Injectable()
export class JwtAuthNoActiveGuard extends AuthGuard('jwt-no-active') {}
