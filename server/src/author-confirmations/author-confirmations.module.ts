import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthorConfirmationStatusesModule } from 'src/author-confirmation-statuses/author-confirmation-statuses.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { UsersModule } from 'src/users/users.module';
import { AuthorConfirmationsController } from './author-confirmations.controller';
import { AuthorConfirmationsService } from './author-confirmations.service';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthorsModule,
    AuthorConfirmationStatusesModule,
  ],
  controllers: [AuthorConfirmationsController],
  providers: [AuthorConfirmationsService],
  exports: [AuthorConfirmationsService],
})
export class AuthorConfirmationsModule {}
