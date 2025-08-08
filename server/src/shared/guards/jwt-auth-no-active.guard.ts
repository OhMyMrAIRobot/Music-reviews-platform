import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthNoActiveGuard extends AuthGuard('jwt-no-active') {}
