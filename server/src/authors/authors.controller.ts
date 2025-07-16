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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { AuthorsService } from './authors.service';
import { AuthorsQueryDto } from './dto/authors-query.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { GetAuthorParamsDto } from './dto/get-author-params.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatarImg', maxCount: 1 },
      { name: 'coverImg', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: {
      avatarImg?: Express.Multer.File[];
      coverImg?: Express.Multer.File[];
    },
    @Body() createAuthorDto: CreateAuthorDto,
  ) {
    return this.authorsService.create(
      createAuthorDto,
      files?.avatarImg?.[0],
      files?.coverImg?.[0],
    );
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Get()
  findAll(@Query() query: AuthorsQueryDto) {
    return this.authorsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatarImg', maxCount: 1 },
      { name: 'coverImg', maxCount: 1 },
    ]),
  )
  update(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      avatarImg?: Express.Multer.File[];
      coverImg?: Express.Multer.File[];
    },
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorsService.update(
      id,
      updateAuthorDto,
      files?.avatarImg?.[0],
      files?.coverImg?.[0],
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorsService.remove(id);
  }
}
