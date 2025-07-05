import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { PrismaService } from '../../prisma/prisma.service';
import { DuplicateFieldException } from '../exceptions/duplicate-field.exception';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import {
  GetUsersPrismaResponseDto,
  GetUsersResponseDto,
} from './dto/get-users-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserWithPasswordResponseDto } from './dto/user-with-password-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async isUserExists(email: string, nickname: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: 'insensitive' } },
          { nickname: { equals: nickname, mode: 'insensitive' } },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        throw new DuplicateFieldException('Пользователь', 'email', `${email}`);
      }
      if (existingUser.nickname.toLowerCase() === nickname.toLowerCase()) {
        throw new DuplicateFieldException(
          'Пользователь',
          'никнеймом',
          `${nickname}`,
        );
      }
    }
    return;
  }

  async findAll(query: GetUsersQueryDto): Promise<GetUsersResponseDto> {
    const { limit = 10, offset = 0, query: searchTerm, role, order } = query;

    const where: Prisma.UserWhereInput = searchTerm
      ? {
          OR: [
            { nickname: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
          ],
        }
      : {};

    if (role) {
      where.role = {
        role: {
          equals: role,
          mode: 'insensitive',
        },
      };
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),

      this.prisma.user.findMany({
        where,
        take: limit,
        skip: offset,
        include: {
          role: true,
          profile: { select: { avatar: true } },
        },
        orderBy: { createdAt: order ?? 'desc' },
      }),
    ]);

    return {
      total,
      users: plainToInstance(GetUsersPrismaResponseDto, users),
    };
  }

  async findOne(
    id: string,
    includePassword: boolean = false,
  ): Promise<UserResponseDto | UserWithPasswordResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new EntityNotFoundException('Пользователь', 'id', `${id}`);
    }

    return includePassword
      ? plainToInstance(UserWithPasswordResponseDto, user)
      : plainToInstance(UserResponseDto, user);
  }

  async findByEmail(
    email: string,
    includePassword: boolean = false,
  ): Promise<UserResponseDto | UserWithPasswordResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (!user) {
      throw new EntityNotFoundException('Пользователь', 'email', `${email}`);
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

    await this.isUserExists(
      updateUserDto.email ?? '',
      updateUserDto.nickname ?? '',
    );

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
      throw new ConflictException(`Активация не требуется!`);
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
