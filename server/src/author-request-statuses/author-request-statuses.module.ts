import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthorRequestStatusesController } from './author-request-statuses.controller';
import { AuthorRequestStatusesService } from './author-request-statuses.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthorRequestStatusesController],
  providers: [AuthorRequestStatusesService],
  exports: [AuthorRequestStatusesService],
})
export class AuthorRequestStatusesModule {}
