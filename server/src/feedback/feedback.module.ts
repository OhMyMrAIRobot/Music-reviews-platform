import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { FeedbackStatusesModule } from 'src/feedback-statuses/feedback-statuses.module';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [FeedbackStatusesModule, PrismaModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
