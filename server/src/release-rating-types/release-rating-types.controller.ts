import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { CreateReleaseRatingTypeDto } from './dto/create-release-rating-type.dto';
import { UpdateReleaseRatingTypeDto } from './dto/update-release-rating-type.dto';
import { ReleaseRatingTypesService } from './release-rating-types.service';

@Controller('release-rating-types')
export class ReleaseRatingTypesController {
  constructor(
    private readonly releaseRatingTypesService: ReleaseRatingTypesService,
  ) {}

  @Get()
  findAll() {
    return this.releaseRatingTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.releaseRatingTypesService.findOne(id);
  }

  @Roles(UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createReleaseRatingTypeDto: CreateReleaseRatingTypeDto) {
    return this.releaseRatingTypesService.create(createReleaseRatingTypeDto);
  }

  @Roles(UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReleaseRatingTypeDto: UpdateReleaseRatingTypeDto,
  ) {
    return this.releaseRatingTypesService.update(
      id,
      updateReleaseRatingTypeDto,
    );
  }

  @Roles(UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.releaseRatingTypesService.remove(id);
  }
}
