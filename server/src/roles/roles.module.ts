import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [RolesController],
  providers: [PrismaService, RolesService],
  exports: [RolesService],
})
export class RolesModule {}
