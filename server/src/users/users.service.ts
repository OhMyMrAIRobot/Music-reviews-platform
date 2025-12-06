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
import { plainToInstance } from 'class-transformer';
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
import { UsersQueryDto } from './dto/request/query/users.query.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import {
  UserDetailsDto,
  UserDto,
  UserWithPasswordDto,
} from './dto/response/user.dto';
import { UsersResponseDto } from './dto/response/users.response.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => ProfilesService))
    private profilesService: ProfilesService,
    private readonly prisma: PrismaService,
    private readonly rolesService: RolesService,
    private readonly fileService: FileService,
  ) {}

  /**
   * Check whether a user with given email or nickname already exists.
   *
   * Throws `DuplicateFieldException` when an existing user matches the
   * provided email or nickname.
   *
   * @param email string - candidate email to check
   * @param nickname string - candidate nickname to check
   */
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

  /**
   * Find users according to query filters and return a paginated result.
   *
   * Behaviour:
   * - applies optional search and role filters
   * - resolves pagination `limit` and `offset`
   * - includes related `role` and `profile.socialMedia` relations
   * - maps raw Prisma entities to `UserDetailsDto` instances
   *
   * @param query UsersQueryDto - query parameters for filtering/pagination
   * @returns Promise<UsersResponseDto> paginated users and meta information
   */
  async findAll(query: UsersQueryDto): Promise<UsersResponseDto> {
    const { limit, offset, search, role, order } = query;

    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { nickname: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
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

    const [count, users] = await Promise.all([
      this.prisma.user.count({ where }),

      this.prisma.user.findMany({
        where,
        take: limit,
        skip: offset,
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
        orderBy: [{ createdAt: order ?? 'desc' }, { id: 'desc' }],
      }),
    ]);

    return {
      meta: {
        count,
      },
      items: plainToInstance(UserDetailsDto, users),
    };
  }

  /**
   * Load a user by id.
   *
   * When `includePassword` is true the returned DTO will include the
   * hashed password (useful for internal/authentication flows). The
   * method throws `EntityNotFoundException` when the user is missing.
   *
   * @param id string - user id
   * @param includePassword boolean - whether to include password in the result
   * @returns Promise<UserDto | UserWithPasswordDto> user DTO
   * @throws EntityNotFoundException when user not found
   */
  async findOne(
    id: string,
    includePassword: boolean = false,
  ): Promise<UserDto | UserWithPasswordDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true, registeredAuthor: true },
    });

    if (!user) {
      throw new EntityNotFoundException('Пользователь', 'id', `${id}`);
    }

    return includePassword
      ? plainToInstance(UserWithPasswordDto, user, {
          excludeExtraneousValues: true,
        })
      : plainToInstance(UserDto, user, {
          excludeExtraneousValues: true,
        });
  }

  /**
   * Load full user details (including profile and social media).
   *
   * Uses Prisma includes to fetch nested profile.socialMedia and maps the
   * result to `UserDetailsDto` for consistent API output.
   *
   * @param id string - user id
   * @returns Promise<UserDetailsDto> detailed user DTO
   * @throws EntityNotFoundException when user not found
   */
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

    return plainToInstance(UserDetailsDto, user);
  }

  /**
   * Find a user by email.
   *
   * Similar to `findOne` but queries by email. When `includePassword` is
   * true the returned DTO will include the hashed password.
   *
   * @param email string - user email
   * @param includePassword boolean - include hashed password in result
   * @returns Promise<UserDto | UserWithPasswordDto>
   * @throws EntityNotFoundException when user not found
   */
  async findByEmail(
    email: string,
    includePassword: boolean = false,
  ): Promise<UserDto | UserWithPasswordDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      include: { role: true, registeredAuthor: true },
    });

    if (!user) {
      throw new EntityNotFoundException('Пользователь', 'email', `${email}`);
    }

    return includePassword
      ? plainToInstance(UserWithPasswordDto, user)
      : plainToInstance(UserDto, user);
  }

  /**
   * Update a user's own data.
   *
   * Behaviour:
   * - verifies the current password before applying changes
   * - prevents duplicated email/nickname via `isUserExists`
   * - hashes `newPassword` when provided and preserves existing password otherwise
   * - toggles `isActive` to false when email is changed
   *
   * @param id string - id of user to update
   * @param dto UpdateUserRequestDto - update payload
   * @returns Promise<UserDto> updated user DTO without password
   * @throws InvalidCredentialsException when provided current password is incorrect
   */
  async update(id: string, dto: UpdateUserRequestDto): Promise<UserDto> {
    const user: UserWithPasswordDto = await this.findOne(id, true);
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
      include: { role: true, registeredAuthor: true },
    });

    return plainToInstance(UserDto, updatedUser);
  }

  /**
   * Admin update for a user.
   *
   * Behaviour:
   * - validates provided data and permissions of the requesting admin
   * - prevents setting protected roles without sufficient privileges
   * - applies changes and returns `UserDetailsDto` with nested profile
   *
   * @param id string - target user id
   * @param dto AdminUpdateUserRequestDto - admin patch payload
   * @param req IAuthenticatedRequest - request containing authenticated admin
   * @returns Promise<UserDetailsDto> updated detailed user DTO
   * @throws NoDataProvidedException when dto is empty
   * @throws InsufficientPermissionsException when admin lacks permissions
   */
  async adminUpdate(
    id: string,
    dto: AdminUpdateUserRequestDto,
    req: IAuthenticatedRequest,
  ): Promise<UserDetailsDto> {
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

    return plainToInstance(UserDetailsDto, updatedUser);
  }

  /**
   * Delete a user and cleanup related profile files.
   *
   * Performs existence checks, deletes the user DB row and removes
   * associated avatar/cover files from storage when present.
   *
   * @param id string - user id to delete
   */
  async delete(id: string) {
    await this.findOne(id);

    const profile = await this.profilesService.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    if (profile.avatar !== '') {
      await this.fileService.deleteFile('avatars/' + profile.avatar);
    }

    if (profile.coverImage !== '') {
      await this.fileService.deleteFile('covers/' + profile.coverImage);
    }

    return;
  }

  /**
   * Admin delete wrapper that enforces permission checks.
   *
   * @param req IAuthenticatedRequest - authenticated admin request
   * @param id string - target user id
   */
  async adminDelete(req: IAuthenticatedRequest, id: string) {
    await this.checkPermissions(req.user, id);

    return this.delete(id);
  }

  /**
   * Activate a user account.
   *
   * Throws `ConflictException` when the account is already active.
   *
   * @param id string - user id to activate
   * @returns Promise<UserDto> activated user DTO
   */
  async activateUser(id: string): Promise<UserDto> {
    const user = await this.findOne(id);

    if (user.isActive) {
      throw new ConflictException(`Активация не требуется!`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      include: { role: true, registeredAuthor: true },
    });

    return plainToInstance(UserDto, updatedUser);
  }

  /**
   * Verify a plaintext password against a stored bcrypt hash.
   *
   * @param currentPassword string - plaintext candidate password
   * @param storedPassword string - bcrypt hashed password stored in DB
   * @returns Promise<boolean> true when the password matches
   */
  async verifyPassword(
    currentPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(currentPassword, storedPassword);
  }

  /**
   * Create a bcrypt hash for a plaintext password.
   *
   * @param password string - plaintext password
   * @returns Promise<string> bcrypt hash
   */
  async createPasswordHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Check whether the acting user has permissions to perform actions on
   * the target user.
   *
   * This helper throws exceptions on forbidden actions (editing self,
   * editing root admin, or admin-on-admin edits).
   *
   * @param authUser IJwtAuthPayload - authenticated user payload
   * @param targetId string - id of the target user
   */
  async checkPermissions(authUser: IJwtAuthPayload, targetId: string) {
    if (targetId === authUser.id) {
      throw new BadRequestException('Вы не можете редактировать свой аккаунт!');
    }

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
