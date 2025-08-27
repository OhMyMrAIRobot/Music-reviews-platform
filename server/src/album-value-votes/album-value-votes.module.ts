import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ReleasesModule } from 'src/releases/releases.module';
import { UsersModule } from 'src/users/users.module';
import { AlbumValueVotesController } from './album-value-votes.controller';
import { AlbumValueVotesService } from './album-value-votes.service';

@Module({
  imports: [PrismaModule, UsersModule, ReleasesModule],
  controllers: [AlbumValueVotesController],
  providers: [AlbumValueVotesService],
  exports: [AlbumValueVotesService],
})
export class AlbumValueVotesModule {}
