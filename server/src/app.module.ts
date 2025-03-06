import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { PrismaService } from './prisma.service';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';

@Module({
  imports: [],
  controllers: [AuthController, RolesController],
  providers: [PrismaService, RolesService],
})
export class AppModule {}
