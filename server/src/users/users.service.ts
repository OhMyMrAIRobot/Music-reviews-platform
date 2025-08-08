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
import { FileService } from 'src/file/files.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { RolesService } from 'src/roles/roles.service';
import { UserRoleEnum } from 'src/roles/types/user-role.enum';
import { InsufficientPermissionsException } from 'src/shared/exceptions/insufficient-permissions.exception';
import { NoDataProvidedException } from 'src/shared/exceptions/no-data.exception';
import { PrismaService } from '../../prisma/prisma.service';
import { DuplicateFieldException } from '../shared/exceptions/duplicate-field.exception';
import { EntityNotFoundException } from '../shared/exceptions/entity-not-found.exception';
import { InvalidCredentialsException } from '../shared/exceptions/invalid-credentials.exception';
import { AdminUpdateUserRequestDto } from './dto/request/admin-update-user.request.dto';
import { FindUsersQuery } from './dto/request/query/find-users.query.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { FindUserDetailsResponse } from './dto/response/find-user-details.response.dto';
import {
  FindUsersPrismaResponseDto,
  FindUsersResponseDto,
} from './dto/response/find-users.response.dto';
import { UserWithPasswordResponseDto } from './dto/response/user-with-password.response.dto';
import { UserResponseDto } from './dto/response/user.response.dto';

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

  async findAll(query: FindUsersQuery): Promise<FindUsersResponseDto> {
    const { limit, offset, query: searchTerm, role, order } = query;

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
      users: plainToInstance(FindUsersPrismaResponseDto, users),
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

  async findUserDetails(id: string) {
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

    return plainToInstance(FindUserDetailsResponse, user);
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
    dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    const user: UserWithPasswordResponseDto = await this.findOne(id, true);
    if (!(await this.verifyPassword(dto.password, user.password))) {
      throw new InvalidCredentialsException();
    }

    await this.isUserExists(dto.email ?? '', dto.nickname ?? '');

    if (dto.newPassword) {
      dto.password = await this.createPasswordHash(dto.newPassword);
      dto.newPassword = undefined;
    } else {
      dto.password = user.password;
    }

    if (dto.email) {
      dto.isActive = false;
    } else {
      dto.isActive = user.isActive;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dto,
      include: { role: true },
    });

    return plainToClass(UserResponseDto, updatedUser);
  }

  async adminUpdate(
    id: string,
    dto: AdminUpdateUserRequestDto,
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

    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });

    if (profile.avatar !== '') {
      await this.fileService.deleteFile('avatars/' + profile.avatar);
    }

    if (profile.coverImage !== '') {
      await this.fileService.deleteFile('covers/' + profile.coverImage);
    }

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
