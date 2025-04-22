import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FeedbackStatusesController } from './feedback-statuses.controller';
import { FeedbackStatusesService } from './feedback-statuses.service';

@Module({
  controllers: [FeedbackStatusesController],
  providers: [FeedbackStatusesService, PrismaService],
  exports: [FeedbackStatusesService],
})
export class FeedbackStatusesModule {}
