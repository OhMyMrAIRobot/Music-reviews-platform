import { Module } from '@nestjs/common';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [ProfilesModule],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
