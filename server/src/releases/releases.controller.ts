import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { AuthorTopReleasesParamsDto } from './dto/author-top-releases-params.dto';
import { CreateReleaseDto } from './dto/create-release.dto';
import { ReleaseDetailsParamsDto } from './dto/release-details-params.dto';
import { ReleasesQueryDto } from './dto/releases-query.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';
import { ReleasesService } from './releases.service';

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  @Get()
  findAll() {
    return this.releasesService.findAll();
  }

  @Get('list/most-commented')
  findMostCommented() {
    return this.releasesService.findMostCommentedReleasesLastDay();
  }

  @Get('list')
  findReleases(@Query() query: ReleasesQueryDto) {
    return this.releasesService.findReleases(query);
  }

  @Get('author/top/:id')
  findAuthorTopReleases(@Param() params: AuthorTopReleasesParamsDto) {
    return this.releasesService.findAuthorReleases(params.id, false);
  }

  @Get('author/all/:id')
  findAuthorAllReleases(@Param() params: AuthorTopReleasesParamsDto) {
    return this.releasesService.findAuthorReleases(params.id, true);
  }

  @Get('details/:id')
  findReleaseDetails(@Param() params: ReleaseDetailsParamsDto) {
    return this.releasesService.findReleaseDetails(params.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.releasesService.findOne(id);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createReleaseDto: CreateReleaseDto) {
    return this.releasesService.create(createReleaseDto);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReleaseDto: UpdateReleaseDto) {
    return this.releasesService.update(id, updateReleaseDto);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.releasesService.remove(id);
  }
}
