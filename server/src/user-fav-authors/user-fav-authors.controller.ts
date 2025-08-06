import {
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
import { UserFavAuthorsService } from './user-fav-authors.service';

@Controller('user-fav-authors')
export class UserFavAuthorsController {
  constructor(private readonly userFavAuthorsService: UserFavAuthorsService) {}

  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    return this.userFavAuthorsService.findByUserId(id);
  }

  @Get('author/:id')
  findByAuthorId(@Param('id') id: string) {
    return this.userFavAuthorsService.findByAuthorId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':authorId')
  create(
    @Param('authorId') authorId: string,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.userFavAuthorsService.create(authorId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':authorId')
  remove(
    @Param('authorId') authorId: string,
    @Request() req: IAuthenticatedRequest,
  ) {
    return this.userFavAuthorsService.remove(authorId, req.user.id);
  }
}
