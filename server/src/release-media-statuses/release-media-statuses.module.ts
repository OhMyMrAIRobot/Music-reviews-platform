import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReleaseMediaStatusesController } from './release-media-statuses.controller';
import { ReleaseMediaStatusesService } from './release-media-statuses.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReleaseMediaStatusesController],
  providers: [ReleaseMediaStatusesService],
  exports: [ReleaseMediaStatusesService],
})
export class ReleaseMediaStatusesModule {}
