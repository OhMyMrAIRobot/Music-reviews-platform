import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ReleaseTypesModule } from 'src/release-types/release-types.module';
import { ReleasesController } from './releases.controller';
import { ReleasesService } from './releases.service';

@Module({
  imports: [ReleaseTypesModule],
  controllers: [ReleasesController],
  providers: [ReleasesService, PrismaService],
  exports: [ReleasesService],
})
export class ReleasesModule {}
