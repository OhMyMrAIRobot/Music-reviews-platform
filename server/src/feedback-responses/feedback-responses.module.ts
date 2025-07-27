import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { UsersModule } from 'src/users/users.module';
import { FeedbackResponsesController } from './feedback-responses.controller';
import { FeedbackResponsesService } from './feedback-responses.service';

@Module({
  imports: [PrismaModule, FeedbackModule, UsersModule],
  controllers: [FeedbackResponsesController],
  providers: [FeedbackResponsesService],
  exports: [FeedbackResponsesService],
})
export class FeedbackResponsesModule {}
