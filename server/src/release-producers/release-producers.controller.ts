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
import { CreateReleaseProducerDto } from './dto/create-release-producer.dto';
import { DeleteReleaseProducerDto } from './dto/delete-release-producer.dto';
import { ReleaseProducersService } from './release-producers.service';

@Controller('release-producers')
export class ReleaseProducersController {
  constructor(
    private readonly releaseProducersService: ReleaseProducersService,
  ) {}

  @Get()
  findAll() {
    return this.releaseProducersService.findAll();
  }

  @Get('producer/:id')
  findByAuthorId(@Param('id') id: string) {
    return this.releaseProducersService.findByAuthorId(id);
  }

  @Get('release/:id')
  findByReleaseId(@Param('id') id: string) {
    return this.releaseProducersService.findByReleaseId(id);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createReleaseProducerDto: CreateReleaseProducerDto) {
    return this.releaseProducersService.create(createReleaseProducerDto);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete()
  remove(@Body() deleteReleaseProducerDto: DeleteReleaseProducerDto) {
    return this.releaseProducersService.remove(deleteReleaseProducerDto);
  }
}
