import {
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { ProfilesService } from 'src/profiles/services/profiles.service';

function createStorage(folder: string) {
  const dir = `./public/${folder}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return diskStorage({
    destination: dir,
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
}

@Controller('uploads')
export class UploadsController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createStorage('avatars'),
    }),
  )
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.profilesService.updateByUserId(req.user.id, {
      avatar: file.filename,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('cover')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createStorage('covers'),
    }),
  )
  uploadCover(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.profilesService.updateByUserId(req.user.id, {
      coverImage: file.filename,
    });
  }
}
