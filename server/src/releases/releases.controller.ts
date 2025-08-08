import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CreateReleaseRequestDto } from './dto/request/create-release.response.dto';
import { FindReleaseDetailsParams } from './dto/request/params/find-release-details-params.dto';
import { FindReleasesByAuthorIdParams } from './dto/request/params/find-releases-by-author-id.params.dto';
import { FindReleasesByAuthorIdQuery } from './dto/request/query/find-releases-by-author-id.query.dto';
import { FindReleasesQuery } from './dto/request/query/find-releases.query.dto';
import { FindTopRatingReleasesQuery } from './dto/request/query/find-top-rating-releases.query.dto';
import { UpdateReleaseRequestDto } from './dto/request/update-release.request.dto';
import { ReleasesService } from './releases.service';

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  @Get('public')
  findReleases(@Query() query: FindReleasesQuery) {
    return this.releasesService.findReleases(query);
  }

  @Get('details/:id')
  findReleaseDetails(@Param() params: FindReleaseDetailsParams) {
    return this.releasesService.findReleaseDetails(params.id);
  }

  @Get('public/most-commented')
  findMostCommented() {
    return this.releasesService.findMostCommentedReleasesLastDay();
  }

  @Get('top-rating')
  findTopRatingReleases(@Query() params: FindTopRatingReleasesQuery) {
    return this.releasesService.findTopRatingReleases(params);
  }

  @Get('author/:authorId')
  findByAuthorId(
    @Param() params: FindReleasesByAuthorIdParams,
    @Query() query: FindReleasesByAuthorIdQuery,
  ) {
    return this.releasesService.findAuthorReleases(params.authorId, query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'coverImg', maxCount: 1 }]))
  @Post()
  create(
    @Body() dto: CreateReleaseRequestDto,
    @UploadedFiles()
    files: {
      coverImg?: Express.Multer.File[];
    },
  ) {
    return this.releasesService.create(dto, files?.coverImg?.[0]);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Get('admin')
  findAll(@Query() query: FindReleasesQuery) {
    return this.releasesService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'coverImg', maxCount: 1 }]))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReleaseRequestDto,
    @UploadedFiles()
    files: {
      coverImg?: Express.Multer.File[];
    },
  ) {
    return this.releasesService.update(id, dto, files?.coverImg?.[0]);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.releasesService.remove(id);
  }
}
