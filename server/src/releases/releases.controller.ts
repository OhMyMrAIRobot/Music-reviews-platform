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
import { CreateReleaseRequestDto } from './dto/request/create-release.request.dto';
import { ReleasesQueryDto } from './dto/request/query/releases.query.dto';
import { UpdateReleaseRequestDto } from './dto/request/update-release.request.dto';
import { ReleasesService } from './releases.service';

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  /**
   * GET /releases
   *
   * Returns a paginated list of releases according to provided query filters.
   * Delegates to `ReleasesService.findAll`.
   */
  @Get()
  findAll(@Query() query: ReleasesQueryDto) {
    return this.releasesService.findAll(query);
  }

  /**
   * GET /releases/:id
   *
   * Returns a single release by id. If the release is not found, the service
   * will throw a 404-like exception.
   */
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.releasesService.findById(id);
  }

  /**
   * POST /releases
   *
   * Creates a new release. Requires ADMIN or ROOT_ADMIN role.
   * Accepts optional `coverImg` multipart file.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'coverImg', maxCount: 1 }]))
  create(
    @Body() dto: CreateReleaseRequestDto,
    @UploadedFiles()
    files: {
      coverImg?: Express.Multer.File[];
    },
  ) {
    return this.releasesService.create(dto, files?.coverImg?.[0]);
  }

  /**
   * PATCH /releases/:id
   *
   * Updates an existing release. Requires ADMIN or ROOT_ADMIN role.
   * Accepts partial update DTO and optional `coverImg` file.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'coverImg', maxCount: 1 }]))
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

  /**
   * DELETE /releases/:id
   *
   * Deletes a release by id. Requires ADMIN or ROOT_ADMIN role.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  remove(@Param('id') id: string) {
    return this.releasesService.remove(id);
  }
}
