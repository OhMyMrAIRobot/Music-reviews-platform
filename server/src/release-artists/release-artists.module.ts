import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthorsModule } from 'src/authors/authors.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { ReleaseArtistsController } from './release-artists.controller';
import { ReleaseArtistsService } from './release-artists.service';

@Module({
  imports: [ReleasesModule, AuthorsModule],
  controllers: [ReleaseArtistsController],
  providers: [ReleaseArtistsService, PrismaService],
  exports: [ReleaseArtistsService],
})
export class ReleaseArtistsModule {}
