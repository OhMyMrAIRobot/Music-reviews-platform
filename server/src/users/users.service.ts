import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { PrismaService } from '../../prisma/prisma.service';
import { DuplicateFieldException } from '../exceptions/duplicate-field.exception';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserWithPasswordResponseDto } from './dto/user-with-password-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

  async findOne(
    id: string,
    includePassword: boolean = false,
  ): Promise<UserResponseDto | UserWithPasswordResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new EntityNotFoundException('User', 'id', `${id}`);
    }

    return includePassword
      ? plainToInstance(UserWithPasswordResponseDto, user)
      : plainToInstance(UserResponseDto, user);
  }

  async findByEmail(
    email: string,
    includePassword: boolean = false,
  ): Promise<UserResponseDto | UserWithPasswordResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new EntityNotFoundException('User', 'email', `${email}`);
    }

    return includePassword
      ? plainToInstance(UserWithPasswordResponseDto, user)
      : plainToInstance(UserResponseDto, user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user: UserWithPasswordResponseDto = await this.findOne(id, true);
    if (!(await this.verifyPassword(updateUserDto.password, user.password))) {
      throw new InvalidCredentialsException();
    }

    if (updateUserDto.newPassword) {
      updateUserDto.password = await this.createPasswordHash(
        updateUserDto.newPassword,
      );
      updateUserDto.newPassword = undefined;
    } else {
      updateUserDto.password = user.password;
    }

    if (updateUserDto.email) {
      updateUserDto.isActive = false;
    } else {
      updateUserDto.isActive = user.isActive;
    }

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
    const user = await this.findOne(id);

    if (user.isActive) {
      throw new ConflictException(
        `User with id: ${id} doesn't need activation!`,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    return plainToClass(UserResponseDto, updatedUser);
  }

  async verifyPassword(
    currentPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(currentPassword, storedPassword);
  }

  async createPasswordHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
