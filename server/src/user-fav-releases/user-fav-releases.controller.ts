import {
  Body,
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
import { CreateUserFavReleaseDto } from './dto/create-user-fav-release.dto';
import { DeleteUserFavReleaseDto } from './dto/delete-user-fav-release.dto';
import { UserFavReleasesService } from './user-fav-releases.service';

@Controller('user-fav-releases')
export class UserFavReleasesController {
  constructor(
    private readonly userFavReleasesService: UserFavReleasesService,
  ) {}

  @Get()
  findAll() {
    return this.userFavReleasesService.findAll();
  }

  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    return this.userFavReleasesService.findByUserId(id);
  }

  @Get('release/:id')
  findByReleaseId(@Param('id') id: string) {
    return this.userFavReleasesService.findByReleaseId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: IAuthenticatedRequest,
    @Body() createUserFavReleaseDto: CreateUserFavReleaseDto,
  ) {
    return this.userFavReleasesService.create(
      createUserFavReleaseDto,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(
    @Request() req: IAuthenticatedRequest,
    @Body() deleteUserFavReleaseDto: DeleteUserFavReleaseDto,
  ) {
    return this.userFavReleasesService.remove(
      deleteUserFavReleaseDto,
      req.user.id,
    );
  }
}
