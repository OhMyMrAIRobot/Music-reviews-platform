import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { RolesService } from '../roles/roles.service';
import { UserWithPasswordResponseDto } from './dto/userWithPassword-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private roleService: RolesService,
  ) {}

  async isUserExists(email: string, nickname: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { nickname }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException(`User with email: ${email} already exists`);
      }
      if (existingUser.nickname === nickname) {
        throw new ConflictException(
          `User with nickname: ${nickname} already exists`,
        );
      }
    }
    return;
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany();

    return plainToInstance(UserResponseDto, users);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found!`);
    }

    return plainToClass(UserResponseDto, user);
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, roleId: true },
    });

    return plainToClass(UserResponseDto, user);
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<UserWithPasswordResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return plainToInstance(UserWithPasswordResponseDto, user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with id: ${id} not found!`);
    }

    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('No data provided for update');
    }

    if (updateUserDto.roleId) {
      await this.roleService.getRoleById(updateUserDto.roleId);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return plainToClass(UserResponseDto, updatedUser);
  }

  async remove(id: string): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with id: ${id} not found!`);
    }

    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });

    return plainToClass(UserResponseDto, deletedUser);
  }
}
