import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { FileModule } from 'src/file/files.module';
import { UsersModule } from 'src/users/users.module';
import { SocialMediaModule } from '../social-media/social-media.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    SocialMediaModule,
    PrismaModule,
    FileModule,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
