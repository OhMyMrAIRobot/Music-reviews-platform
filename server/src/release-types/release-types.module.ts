import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReleaseTypesController } from './release-types.controller';
import { ReleaseTypesService } from './release-types.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReleaseTypesController],
  providers: [ReleaseTypesService],
  exports: [ReleaseTypesService],
})
export class ReleaseTypesModule {}
