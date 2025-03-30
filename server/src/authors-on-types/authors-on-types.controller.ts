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
import { AuthorsOnTypesService } from './authors-on-types.service';
import { CreateAuthorsOnTypeDto } from './dto/create-authors-on-type.dto';
import { DeleteAuthorsOnTypeDto } from './dto/delete-authors-on-type.dto';

@Controller('authors-on-types')
export class AuthorsOnTypesController {
  constructor(private readonly authorsOnTypesService: AuthorsOnTypesService) {}

  @Get()
  findAll() {
    return this.authorsOnTypesService.findAll();
  }

  @Get(':authorId')
  findByAuthorId(@Param('authorId') authorId: string) {
    return this.authorsOnTypesService.findByAuthorId(authorId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createAuthorsOnTypeDto: CreateAuthorsOnTypeDto) {
    return this.authorsOnTypesService.create(createAuthorsOnTypeDto);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ROOT_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete()
  remove(@Body() deleteAuthorsOnTypeDto: DeleteAuthorsOnTypeDto) {
    return this.authorsOnTypesService.remove(deleteAuthorsOnTypeDto);
  }
}
