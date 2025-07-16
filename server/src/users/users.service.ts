/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { IAuthenticatedRequest } from 'src/auth/types/authenticated-request.interface';
import { IJwtAuthPayload } from 'src/auth/types/jwt-auth-payload.interface';
import { InsufficientPermissionsException } from 'src/exceptions/insufficient-permissions.exception';
import { NoDataProvidedException } from 'src/exceptions/no-data.exception';
import { FileService } from 'src/file/files.service';
import { ProfilesService } from 'src/profiles/services/profiles.service';
import { RolesService } from 'src/roles/roles.service';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { DuplicateFieldException } from '../exceptions/duplicate-field.exception';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import {
  GetUsersPrismaResponseDto,
  GetUsersResponseDto,
} from './dto/get-users-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFullInfo } from './dto/user-full-info.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserWithPasswordResponseDto } from './dto/user-with-password-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => ProfilesService))
    private profilesService: ProfilesService,
    private readonly prisma: PrismaService,
    private readonly rolesService: RolesService,
    private readonly fileService: FileService,
  ) {}

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
        orderBy: [{ createdAt: order ?? 'desc' }, { id: 'desc' }],
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
      include: { role: true },
    });

    if (!user) {
      throw new EntityNotFoundException('Пользователь', 'id', `${id}`);
    }

    return includePassword
      ? plainToInstance(UserWithPasswordResponseDto, user)
      : plainToInstance(UserResponseDto, user);
  }

  async getFullUserInfoById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        profile: {
          include: {
            socialMedia: {
              include: {
                social: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new EntityNotFoundException('Пользователь', 'id', `${id}`);
    }

    return plainToInstance(UserFullInfo, user);
  }

  async findByEmail(
    email: string,
    includePassword: boolean = false,
  ): Promise<UserResponseDto | UserWithPasswordResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      include: { role: true },
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
      include: { role: true },
    });

    return plainToClass(UserResponseDto, updatedUser);
  }

  async adminUpdate(
    id: string,
    dto: AdminUpdateUserDto,
    req: IAuthenticatedRequest,
  ): Promise<UserResponseDto> {
    if (!dto || Object.keys(dto).length === 0) {
      throw new NoDataProvidedException();
    }

    const authRole = await this.rolesService.findByName(req.user.role);

    await this.checkPermissions(req.user, id);

    await this.isUserExists(dto.email ?? '', dto.nickname ?? '');

    if (dto.roleId) {
      const updatedRole = await this.rolesService.findById(dto.roleId);
      if (
        !Object.values(UserRoleEnum).includes(updatedRole.role as UserRoleEnum)
      ) {
        throw new EntityNotFoundException('Роль', 'название', updatedRole.role);
      }

      if (
        updatedRole.role === UserRoleEnum.ADMIN &&
        authRole.role !== UserRoleEnum.ROOT_ADMIN
      ) {
        throw new InsufficientPermissionsException();
      }

      if (updatedRole.role === UserRoleEnum.ROOT_ADMIN) {
        throw new InsufficientPermissionsException();
      }
    }

    const updatedUser = this.prisma.user.update({
      where: { id },
      data: dto,
      include: { role: true },
    });

    return plainToClass(UserResponseDto, updatedUser);
  }

  async delete(id: string): Promise<UserResponseDto> {
    await this.findOne(id);

    const profile = await this.profilesService.findByUserId(id);

    if (profile.avatar !== '') {
      await this.fileService.deleteFile('avatars/' + profile.avatar);
    }

    if (profile.coverImage !== '') {
      await this.fileService.deleteFile('covers/' + profile.coverImage);
    }

    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });

    return plainToClass(UserResponseDto, deletedUser);
  }

  async adminDelete(req: IAuthenticatedRequest, id: string) {
    await this.checkPermissions(req.user, id);

    return this.delete(id);
  }

  async activateUser(id: string): Promise<UserResponseDto> {
    const user = await this.findOne(id);

    if (user.isActive) {
      throw new ConflictException(`Активация не требуется!`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      include: { role: true },
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

  async checkPermissions(authUser: IJwtAuthPayload, targetId: string) {
    if (targetId === authUser.id) {
      throw new BadRequestException('Вы не можете редактировать свой аккаунт!');
    }

    // Check permissions
    const targetUser = await this.findOne(targetId);

    if (targetUser.role.role === UserRoleEnum.ROOT_ADMIN) {
      throw new InsufficientPermissionsException();
    }

    if (
      authUser.role === UserRoleEnum.ADMIN &&
      targetUser.role.role === UserRoleEnum.ADMIN
    ) {
      throw new InsufficientPermissionsException();
    }
  }
}
