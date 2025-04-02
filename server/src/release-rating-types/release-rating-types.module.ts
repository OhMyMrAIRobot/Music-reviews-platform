import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ReleaseRatingTypesController } from './release-rating-types.controller';
import { ReleaseRatingTypesService } from './release-rating-types.service';

@Module({
  controllers: [ReleaseRatingTypesController],
  providers: [ReleaseRatingTypesService, PrismaService],
  exports: [ReleaseRatingTypesService],
})
export class ReleaseRatingTypesModule {}
