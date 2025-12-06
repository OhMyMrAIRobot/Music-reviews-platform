import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { ReleaseMediaStatusesService } from 'src/release-media-statuses/release-media-statuses.service';
import { ReleaseMediaStatusesEnum } from 'src/release-media-statuses/types/release-media-statuses.enum';
import { ReleaseMediaTypesService } from 'src/release-media-types/release-media-types.service';
import { ReleaseMediaTypesEnum } from 'src/release-media-types/types/release-media-types.enum';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CreateReleaseMediaRequestDto } from './dto/request/create-release-media.request.dto';
import { ReleaseMediaQueryDto } from './dto/request/query/release-media.query.dto';
import { UpdateReleaseMediaRequestDto } from './dto/request/update-release-media.request.dto';
import { ReleaseMediaService } from './release-media.service';

@Controller('release-media')
export class ReleaseMediaController {
  constructor(
    private readonly releaseMediaService: ReleaseMediaService,
    private readonly releaseMediaTypesService: ReleaseMediaTypesService,
    private readonly releaseMediaStatusesService: ReleaseMediaStatusesService,
  ) {}

  /**
   * POST /release-media
   *
   * Create a new media review. Requires an authenticated user with the
   * `MEDIA` role. The controller resolves default `type` and `status`
   * values and delegates creation to `ReleaseMediaService.create`.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.MEDIA)
  async create(
    @Body() dto: CreateReleaseMediaRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    const type = await this.releaseMediaTypesService.findByType(
      ReleaseMediaTypesEnum.MEDIA_REVIEW,
    );

    const status = await this.releaseMediaStatusesService.findByStatus(
      ReleaseMediaStatusesEnum.PENDING,
    );

    return this.releaseMediaService.create({
      ...dto,
      userId: req.user.id,
      releaseMediaTypeId: type.id,
      releaseMediaStatusId: status.id,
    });
  }

  /**
   * GET /release-media
   *
   * Returns a paginated list of media entries according to query filters.
   * Delegates to `ReleaseMediaService.findAll` which performs filtering
   * and aggregation via a centralized raw SQL query.
   */
  @Get()
  findAll(@Query() query: ReleaseMediaQueryDto) {
    return this.releaseMediaService.findAll(query);
  }

  /**
   * GET /release-media/:id
   *
   * Return a single media entry by id. Delegates to
   * `ReleaseMediaService.findById` which throws when the entity is missing.
   */
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.releaseMediaService.findById(id);
  }

  /**
   * PATCH /release-media/:id
   *
   * Update an existing media entry. Requires authenticated owner with
   * `MEDIA` role. Delegates to `ReleaseMediaService.update` which performs
   * validation and permission checks.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.MEDIA)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReleaseMediaRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.releaseMediaService.update(id, dto, req.user.id);
  }

  /**
   * DELETE /release-media/:id
   *
   * Delete a media entry. Requires authenticated owner with `MEDIA` role.
   * Delegates to `ReleaseMediaService.remove` which enforces permission
   * checks and deletes the database record.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.MEDIA)
  remove(@Param('id') id: string, @Request() req: IAuthenticatedRequest) {
    return this.releaseMediaService.remove(id, req.user.id);
  }
}
