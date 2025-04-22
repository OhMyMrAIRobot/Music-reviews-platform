import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ReleaseTypesController } from './release-types.controller';
import { ReleaseTypesService } from './release-types.service';

@Module({
  controllers: [ReleaseTypesController],
  providers: [ReleaseTypesService, PrismaService],
  exports: [ReleaseTypesService],
})
export class ReleaseTypesModule {}
