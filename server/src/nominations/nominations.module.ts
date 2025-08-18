import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { NominationsController } from './nominations.controller';
import { NominationsService } from './nominations.service';

@Module({
  imports: [PrismaModule],
  controllers: [NominationsController],
  providers: [NominationsService],
  exports: [NominationsService],
})
export class NominationsModule {}
