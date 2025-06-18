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
import { CreateReleaseDesignerDto } from './dto/create-release-designer.dto';
import { DeleteReleaseDesignerDto } from './dto/delete-release-designer.dto';
import { ReleaseDesignersService } from './release-designers.service';

@Controller('release-designers')
export class ReleaseDesignersController {
  constructor(
    private readonly releaseDesignersService: ReleaseDesignersService,
  ) {}

  @Get()
  findAll() {
    return this.releaseDesignersService.findAll();
  }

  @Get('designer/:id')
  findByAuthorId(@Param('id') id: string) {
    return this.releaseDesignersService.findByAuthorId(id);
  }

  @Get('release/:id')
  findByReleaseId(@Param('id') id: string) {
    return this.releaseDesignersService.findByReleaseId(id);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createReleaseDesignerDto: CreateReleaseDesignerDto) {
    return this.releaseDesignersService.create(createReleaseDesignerDto);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete()
  remove(@Body() deleteReleaseDesignerDto: DeleteReleaseDesignerDto) {
    return this.releaseDesignersService.remove(deleteReleaseDesignerDto);
  }
}
