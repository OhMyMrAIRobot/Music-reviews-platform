import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtNoActiveStrategy } from './strategies/jwt-no-active.strategy';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { MailsModule } from '../mails/mails.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
    RolesModule,
    MailsModule,
  ],
  providers: [AuthService, JwtStrategy, JwtNoActiveStrategy, PrismaService],
  controllers: [AuthController],
  exports: [JwtStrategy, AuthService],
})
export class AuthModule {}
