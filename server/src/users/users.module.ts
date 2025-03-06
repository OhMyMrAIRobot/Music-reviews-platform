import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { RolesService } from '../roles/roles.service';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, UsersService, RolesService],
})
export class UsersModule {}
