import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from '../roles/roles.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
    RolesModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy],
})
export class AuthModule {}
