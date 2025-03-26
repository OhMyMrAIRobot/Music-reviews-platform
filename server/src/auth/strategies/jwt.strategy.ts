import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtAuthPayload } from '../types/jwt-auth-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'secret',
    });
  }

  validate(payload: IJwtAuthPayload) {
    if (!payload.isActive) {
      throw new ForbiddenException('Аккаунт не активирован!');
    }
    return payload;
  }
}
