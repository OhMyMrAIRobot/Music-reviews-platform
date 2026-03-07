import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { ReleaseLyricsController } from './release-lyrics.controller';
import { ReleaseLyricsService } from './release-lyrics.service';

@Module({
  imports: [ReleasesModule, PrismaModule],
  controllers: [ReleaseLyricsController],
  providers: [ReleaseLyricsService],
})
export class ReleaseLyricsModule {}
