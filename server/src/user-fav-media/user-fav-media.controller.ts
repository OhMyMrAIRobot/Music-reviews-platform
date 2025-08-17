import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UserFavMediaService } from './user-fav-media.service';

@Controller('user-fav-media')
export class UserFavMediaController {
  constructor(private readonly userFavMediaService: UserFavMediaService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':mediaId')
  create(
    @Param('mediaId') mediaId: string,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.userFavMediaService.create(mediaId, req.user.id);
  }

  @Get(':mediaId')
  findByMediaId(@Param('mediaId') mediaId: string) {
    return this.userFavMediaService.findByMediaId(mediaId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':mediaId')
  remove(
    @Param('mediaId') mediaId: string,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.userFavMediaService.remove(mediaId, req.user.id);
  }
}
