import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FeedbackStatusesModule } from 'src/feedback-statuses/feedback-statuses.module';
import { FeedbacksController } from './feedbacks.controller';
import { FeedbacksService } from './feedbacks.service';

@Module({
  imports: [FeedbackStatusesModule],
  controllers: [FeedbacksController],
  providers: [FeedbacksService, PrismaService],
  exports: [FeedbacksService],
})
export class FeedbacksModule {}
