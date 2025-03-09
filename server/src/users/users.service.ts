import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { RolesService } from '../roles/roles.service';
import { UserWithPasswordResponseDto } from './dto/userWithPassword-response.dto';
import { DuplicateFieldException } from '../exceptions/duplicate-field.exception';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { NoDataProvidedException } from '../exceptions/no-data.exception';

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
        throw new DuplicateFieldException('User', 'email', `${email}`);
      }
      if (existingUser.nickname === nickname) {
        throw new DuplicateFieldException('User', 'nickname', `${nickname}`);
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
      throw new EntityNotFoundException('User', 'id', `${id}`);
    }

    return plainToClass(UserResponseDto, user);
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<UserWithPasswordResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new EntityNotFoundException('User', 'email', `${email}`);
    }

    return plainToInstance(UserWithPasswordResponseDto, user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new NoDataProvidedException();
    }

    await this.findOne(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return plainToClass(UserResponseDto, updatedUser);
  }

  async remove(id: string): Promise<UserResponseDto> {
    await this.findOne(id);

    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });

    return plainToClass(UserResponseDto, deletedUser);
  }

  async activateUser(id: string): Promise<UserResponseDto> {
    await this.findOne(id);

    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    return plainToClass(UserResponseDto, user);
  }
}
