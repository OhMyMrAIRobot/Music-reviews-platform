import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [UsersModule, AuthModule, RolesModule, ProfilesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
