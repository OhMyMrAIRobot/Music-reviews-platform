import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { FileModule } from 'src/file/files.module';
import { MailsModule } from 'src/mails/mails.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ProfilesModule),
    RolesModule,
    MailsModule,
    PrismaModule,
    RolesModule,
    FileModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
