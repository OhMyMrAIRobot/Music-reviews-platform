import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReleaseRatingTypesController } from './release-rating-types.controller';
import { ReleaseRatingTypesService } from './release-rating-types.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReleaseRatingTypesController],
  providers: [ReleaseRatingTypesService],
  exports: [ReleaseRatingTypesService],
})
export class ReleaseRatingTypesModule {}
