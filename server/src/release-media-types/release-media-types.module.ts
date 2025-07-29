import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReleaseMediaTypesController } from './release-media-types.controller';
import { ReleaseMediaTypesService } from './release-media-types.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReleaseMediaTypesController],
  providers: [ReleaseMediaTypesService],
  exports: [ReleaseMediaTypesService],
})
export class ReleaseMediaTypesModule {}
