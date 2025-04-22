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
import { CreateReleaseTypeDto } from './dto/create-release-type.dto';
import { UpdateReleaseTypeDto } from './dto/update-release-type.dto';
import { ReleaseTypesService } from './release-types.service';

@Controller('release-types')
export class ReleaseTypesController {
  constructor(private readonly releaseTypesService: ReleaseTypesService) {}

  @Get()
  findAll() {
    return this.releaseTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.releaseTypesService.findOne(id);
  }

  @Roles(UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createReleaseTypeDto: CreateReleaseTypeDto) {
    return this.releaseTypesService.create(createReleaseTypeDto);
  }

  @Roles(UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReleaseTypeDto: UpdateReleaseTypeDto,
  ) {
    return this.releaseTypesService.update(id, updateReleaseTypeDto);
  }

  @Roles(UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.releaseTypesService.remove(id);
  }
}
