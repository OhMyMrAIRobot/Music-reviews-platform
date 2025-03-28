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
import { AuthorTypesService } from './author-types.service';
import { CreateAuthorTypeDto } from './dto/create-author-type.dto';
import { UpdateAuthorTypeDto } from './dto/update-author-type.dto';

@Controller('author-types')
export class AuthorTypesController {
  constructor(private readonly authorTypesService: AuthorTypesService) {}

  @Roles(UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createAuthorTypeDto: CreateAuthorTypeDto) {
    return this.authorTypesService.create(createAuthorTypeDto);
  }

  @Get()
  findAll() {
    return this.authorTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorTypesService.findOne(id);
  }

  @Roles(UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthorTypeDto: UpdateAuthorTypeDto,
  ) {
    return this.authorTypesService.update(id, updateAuthorTypeDto);
  }

  @Roles(UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorTypesService.remove(id);
  }
}
