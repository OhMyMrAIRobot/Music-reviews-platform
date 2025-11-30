import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtAuthPayload } from '../types/jwt-auth-payload.interface';

/**
 * JWT strategy that does not require the user to be active.
 *
 * This strategy is useful for endpoints where authentication by token
 * is required but an account active check should be skipped (for
 * example when allowing users to perform actions during activation
 * flows).
 */
export class JwtNoActiveStrategy extends PassportStrategy(
  Strategy,
  'jwt-no-active',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'secret',
    });
  }

  /**
   * Validate the decoded JWT payload.
   *
   * Returns the payload without performing an `isActive` check.
   *
   * @param payload IJwtAuthPayload - decoded token payload
   * @returns IJwtAuthPayload
   */
  validate(payload: IJwtAuthPayload) {
    return payload;
  }
}
