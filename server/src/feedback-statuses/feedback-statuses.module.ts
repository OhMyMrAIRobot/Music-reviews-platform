import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { FeedbackStatusesController } from './feedback-statuses.controller';
import { FeedbackStatusesService } from './feedback-statuses.service';

@Module({
  imports: [PrismaModule],
  controllers: [FeedbackStatusesController],
  providers: [FeedbackStatusesService],
  exports: [FeedbackStatusesService],
})
export class FeedbackStatusesModule {}
