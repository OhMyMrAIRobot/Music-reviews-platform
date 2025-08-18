import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { NominationTypesController } from './nomination-types.controller';
import { NominationTypesService } from './nomination-types.service';

@Module({
  imports: [PrismaModule],
  controllers: [NominationTypesController],
  providers: [NominationTypesService],
  exports: [NominationTypesService],
})
export class NominationTypesModule {}
