import { IJwtAuthPayload } from '../types/jwt-auth-payload.interface';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtNoActiveStrategy extends PassportStrategy(
  Strategy,
  'jwt-no-active',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  validate(payload: IJwtAuthPayload) {
    return payload;
  }
}
