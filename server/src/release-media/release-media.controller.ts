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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { ReleaseMediaStatusesEnum } from 'src/release-media-statuses/entities/release-media-statuses.enum';
import { ReleaseMediaStatusesService } from 'src/release-media-statuses/release-media-statuses.service';
import { ReleaseMediaTypesEnum } from 'src/release-media-types/entities/release-media-types.enum';
import { ReleaseMediaTypesService } from 'src/release-media-types/release-media-types.service';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { AdminCreateReleaseMediaRequestDto } from './dto/request/admin-create-release-media.request.dto';
import { AdminUpdateReleaseMediaRequestDto } from './dto/request/admin-update-release-media.request.dto';
import { CreateReleaseMediaRequestDto } from './dto/request/create-release-media.request.dto';
import { ReleaseMediaRequestQueryDto } from './dto/request/release-media.request.query.dto';
import { UpdateReleaseMediaRequestDto } from './dto/request/update-release-media.request.dto';
import { ReleaseMediaService } from './release-media.service';

@Controller('release-media')
export class ReleaseMediaController {
  constructor(
    private readonly releaseMediaService: ReleaseMediaService,
    private readonly releaseMediaTypesService: ReleaseMediaTypesService,
    private readonly releaseMediaStatusesService: ReleaseMediaStatusesService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SUPER_USER)
  @Post()
  async create(
    @Body() dto: CreateReleaseMediaRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    const type = await this.releaseMediaTypesService.findByType(
      ReleaseMediaTypesEnum.REVIEW,
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Post('/admin')
  adminCreate(@Body() dto: AdminCreateReleaseMediaRequestDto) {
    return this.releaseMediaService.create({
      ...dto,
      userId: undefined,
    });
  }

  @Get()
  findAll(@Query() query: ReleaseMediaRequestQueryDto) {
    return this.releaseMediaService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.releaseMediaService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SUPER_USER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReleaseMediaRequestDto,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.releaseMediaService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Patch('/admin/:id')
  adminUpdate(
    @Param('id') id: string,
    @Body() dto: AdminUpdateReleaseMediaRequestDto,
  ) {
    return this.releaseMediaService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.SUPER_USER)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: IAuthenticatedRequest) {
    return this.releaseMediaService.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Delete('admin/:id')
  adminRemove(@Param('id') id: string) {
    return this.releaseMediaService.remove(id);
  }
}
