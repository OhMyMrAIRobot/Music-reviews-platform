import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { ReleaseDesignersController } from './release-designers.controller';
import { ReleaseDesignersService } from './release-designers.service';

@Module({
  imports: [ReleasesModule, AuthorsModule, PrismaModule],
  controllers: [ReleaseDesignersController],
  providers: [ReleaseDesignersService],
  exports: [ReleaseDesignersService],
})
export class ReleaseDesignersModule {}
