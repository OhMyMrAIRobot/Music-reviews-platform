import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthorTypesController } from './author-types.controller';
import { AuthorTypesService } from './author-types.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthorTypesController],
  providers: [AuthorTypesService],
  exports: [AuthorTypesService],
})
export class AuthorTypesModule {}
