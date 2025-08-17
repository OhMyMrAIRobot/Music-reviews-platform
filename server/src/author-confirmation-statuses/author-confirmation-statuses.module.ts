import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthorConfirmationStatusesController } from './author-confirmation-statuses.controller';
import { AuthorConfirmationStatusesService } from './author-confirmation-statuses.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthorConfirmationStatusesController],
  providers: [AuthorConfirmationStatusesService],
  exports: [AuthorConfirmationStatusesService],
})
export class AuthorConfirmationStatusesModule {}
