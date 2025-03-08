import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../roles/type/userRole';
import { RolesGuard } from '../auth/guard/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.remove(id);
  }
}
