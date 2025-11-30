import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtAuthPayload } from '../types/jwt-auth-payload.interface';

@Injectable()
/**
 * JWT authentication strategy that enforces account activation.
 *
 * Extracts the JWT from the Authorization bearer header, verifies it
 * using the configured secret and rejects requests when the token's
 * payload indicates the user account is not active.
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'secret',
    });
  }

  /**
   * Validate the JWT payload.
   *
   * This method is invoked by Passport after the token has been decoded.
   * It performs an application-level check that the account is active
   * and throws a `ForbiddenException` when it is not.
   *
   * @param payload IJwtAuthPayload - decoded token payload
   * @returns IJwtAuthPayload when valid
   * @throws ForbiddenException when the user's account is not active
   */
  validate(payload: IJwtAuthPayload) {
    if (!payload.isActive) {
      throw new ForbiddenException('Аккаунт не активирован!');
    }
    return payload;
  }
}
