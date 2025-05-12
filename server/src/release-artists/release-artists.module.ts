import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { ReleaseArtistsController } from './release-artists.controller';
import { ReleaseArtistsService } from './release-artists.service';

@Module({
  imports: [ReleasesModule, AuthorsModule, PrismaModule],
  controllers: [ReleaseArtistsController],
  providers: [ReleaseArtistsService],
  exports: [ReleaseArtistsService],
})
export class ReleaseArtistsModule {}
