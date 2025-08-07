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
import { UserFavReleasesService } from './user-fav-releases.service';

@Controller('user-fav-releases')
export class UserFavReleasesController {
  constructor(
    private readonly userFavReleasesService: UserFavReleasesService,
  ) {}

  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    return this.userFavReleasesService.findByUserId(id);
  }

  @Get('release/:id')
  findByReleaseId(@Param('id') id: string) {
    return this.userFavReleasesService.findByReleaseId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':releaseId')
  create(
    @Param('releaseId') releaseId: string,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.userFavReleasesService.create(releaseId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':releaseId')
  remove(
    @Param('releaseId') releaseId: string,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.userFavReleasesService.remove(releaseId, req.user.id);
  }
}
