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
import { AuthorsService } from './authors.service';
import { AuthorsQueryDto } from './dto/authors-query.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { GetAuthorParamsDto } from './dto/get-author-params.dto';
import { SearchAuthorsQueryDto } from './dto/search-authors-query.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  findAll() {
    return this.authorsService.findAll();
  }

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.authorsService.findOne(id);
  }

  @Get('id/:id')
  findById(@Param() params: GetAuthorParamsDto) {
    return this.authorsService.findById(params.id);
  }

  @Get('list')
  findAuthors(@Query() query: AuthorsQueryDto) {
    return this.authorsService.findAuthors(query);
  }

  @Get('search')
  findByName(@Query() query: SearchAuthorsQueryDto) {
    return this.authorsService.findByNameExtended(query);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorsService.remove(id);
  }
}
