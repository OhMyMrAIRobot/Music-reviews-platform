import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { FeedbackStatusesModule } from 'src/feedback-statuses/feedback-statuses.module';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { MailsModule } from 'src/mails/mails.module';
import { UsersModule } from 'src/users/users.module';
import { FeedbackRepliesController } from './feedback-replies.controller';
import { FeedbackRepliesService } from './feedback-replies.service';

@Module({
  imports: [
    forwardRef(() => FeedbackModule),
    PrismaModule,
    UsersModule,
    MailsModule,
    FeedbackStatusesModule,
  ],
  controllers: [FeedbackRepliesController],
  providers: [FeedbackRepliesService],
  exports: [FeedbackRepliesService],
})
export class FeedbackRepliesModule {}
