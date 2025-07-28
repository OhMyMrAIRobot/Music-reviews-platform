import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { FeedbackRepliesModule } from 'src/feedback-replies/feedback-replies.module';
import { FeedbackStatusesModule } from 'src/feedback-statuses/feedback-statuses.module';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [
    forwardRef(() => FeedbackRepliesModule),
    PrismaModule,
    FeedbackStatusesModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
