import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { CreateUserFavAuthorDto } from './dto/create-user-fav-author.dto';
import { DeleteUserFavAuthorDto } from './dto/delete-user-fav-author.dto';
import { UserFavAuthorsService } from './user-fav-authors.service';

@Controller('user-fav-authors')
export class UserFavAuthorsController {
  constructor(private readonly userFavAuthorsService: UserFavAuthorsService) {}

  @Get()
  findAll() {
    return this.userFavAuthorsService.findAll();
  }

  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    return this.userFavAuthorsService.findByUserId(id);
  }

  @Get('author/:id')
  findByAuthorId(@Param('id') id: string) {
    return this.userFavAuthorsService.findByAuthorId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: IAuthenticatedRequest,
    @Body() createUserFavAuthorDto: CreateUserFavAuthorDto,
  ) {
    return this.userFavAuthorsService.create(
      createUserFavAuthorDto,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(
    @Request() req: IAuthenticatedRequest,
    @Body() deleteUserFavAuthorDto: DeleteUserFavAuthorDto,
  ) {
    return this.userFavAuthorsService.remove(
      deleteUserFavAuthorDto,
      req.user.id,
    );
  }
}
