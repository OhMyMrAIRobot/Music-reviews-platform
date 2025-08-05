import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
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

  @Get('media/:id')
  findByMediaId(@Param('id') id: string) {
    return this.userFavMediaService.findByMediaId(id);
  }

  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    return this.userFavMediaService.findByUserId(id);
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
