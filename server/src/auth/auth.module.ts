import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../prisma/prisma.service';
import { MailsModule } from '../mails/mails.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { TokensService } from './service/tokens.service';
import { JwtNoActiveStrategy } from './strategies/jwt-no-active.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

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
  providers: [
    AuthService,
    JwtStrategy,
    JwtNoActiveStrategy,
    PrismaService,
    TokensService,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, AuthService, TokensService],
})
export class AuthModule {}
