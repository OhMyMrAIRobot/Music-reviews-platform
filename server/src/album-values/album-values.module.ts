import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { AlbumValuesController } from './album-values.controller';
import { AlbumValuesService } from './album-values.service';

@Module({
  imports: [PrismaModule, ReleasesModule],
  controllers: [AlbumValuesController],
  providers: [AlbumValuesService],
  exports: [AlbumValuesService],
})
export class AlbumValuesModule {}
