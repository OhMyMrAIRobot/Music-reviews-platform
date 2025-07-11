import { Module } from '@nestjs/common';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [ProfilesModule],
  controllers: [UploadsController],
  providers: [],
})
export class UploadsModule {}
