import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { CreateReleaseArtistDto } from './dto/create-release-artist.dto';
import { DeleteReleaseArtistDto } from './dto/delete-release-artist.dto';
import { ReleaseArtistsService } from './release-artists.service';

@Controller('release-artists')
export class ReleaseArtistsController {
  constructor(private readonly releaseArtistsService: ReleaseArtistsService) {}

  @Get()
  findAll() {
    return this.releaseArtistsService.findAll();
  }

  @Get('artist/:id')
  findByAuthorId(@Param('id') id: string) {
    return this.releaseArtistsService.findByAuthorId(id);
  }

  @Get('release/:id')
  findByReleaseId(@Param('id') id: string) {
    return this.releaseArtistsService.findByReleaseId(id);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createReleaseArtistDto: CreateReleaseArtistDto) {
    return this.releaseArtistsService.create(createReleaseArtistDto);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete()
  remove(@Body() deleteReleaseArtistDto: DeleteReleaseArtistDto) {
    return this.releaseArtistsService.remove(deleteReleaseArtistDto);
  }
}
