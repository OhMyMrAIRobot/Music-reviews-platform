import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { IJwtAuthPayload } from './types/jwt-auth-payload.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RolesService } from '../roles/roles.service';
import { plainToClass } from 'class-transformer';
import { UserRoleEnum } from '../roles/types/user-role.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { InvalidTokenException } from '../exceptions/invalid-token.exception';
import { IJwtActionPayload } from './types/jwt-action-payload.interface';
import { JwtActionEnum } from './types/jwt-action.enum';
import { CodeRequestDto } from './dto/code-request.dto';
import { UserWithPasswordResponseDto } from '../users/dto/user-with-password-response.dto';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<UserResponseDto> {
    const user: UserWithPasswordResponseDto =
      await this.usersService.findByEmail(loginDto.email, true);

    if (
      !user ||
      !(await this.usersService.verifyPassword(
        loginDto.password,
        user.password,
      ))
    ) {
      throw new InvalidCredentialsException();
    }

    return plainToClass(UserResponseDto, user);
  }

  async login(user: UserResponseDto) {
    const role = await this.rolesService.findById(user.roleId);

    const validRole = Object.values(UserRoleEnum).includes(
      role.role as UserRoleEnum,
    )
      ? (role.role as UserRoleEnum)
      : UserRoleEnum.USER;

    const payload: IJwtAuthPayload = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: validRole,
      isActive: user.isActive,
    };

    return { access_token: this.jwtService.sign(payload), user: user };
  }

  async register(registerDto: RegisterDto) {
    await this.usersService.isUserExists(
      registerDto.email,
      registerDto.nickname,
    );

    const hashedPassword = await this.usersService.createPasswordHash(
      registerDto.password,
    );
    const userRole = await this.rolesService.findByName();

    try {
      const user = await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            email: registerDto.email,
            nickname: registerDto.nickname,
            password: hashedPassword,
            roleId: userRole.id,
          },
        });

        await prisma.userProfile.create({
          data: { userId: user.id },
        });

        return user;
      });

      return this.login(plainToClass(UserResponseDto, user));
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(
        'Error occurred during user registration',
      );
    }
  }

  async activateAccount(token: string) {
    try {
      const { id, type } = this.jwtService.verify<IJwtActionPayload>(token);
      if (type !== JwtActionEnum.ACTIVATION) {
        throw new InvalidTokenException();
      }

      const user = await this.usersService.activateUser(id);

      return this.login(user);
    } catch (e) {
      if (e instanceof TokenExpiredError || e instanceof JsonWebTokenError) {
        throw new InvalidTokenException();
      }
      throw e;
    }
  }

  async checkUserAndGetResetToken(codeRequestDto: CodeRequestDto) {
    const user: UserResponseDto = await this.usersService.findByEmail(
      codeRequestDto.email,
    );
    const token = this.generateResetToken(user.id, user.email);
    return { user, token };
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    try {
      const { id, type } = this.jwtService.verify<IJwtActionPayload>(token);
      if (type !== JwtActionEnum.RESET_PASSWORD) {
        throw new InvalidTokenException();
      }

      await this.usersService.findOne(id);

      resetPasswordDto.password = await this.usersService.createPasswordHash(
        resetPasswordDto.password,
      );

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: resetPasswordDto,
      });

      return this.login(updatedUser);
    } catch (e) {
      if (e instanceof TokenExpiredError || e instanceof JsonWebTokenError) {
        throw new InvalidTokenException();
      }
      throw e;
    }
  }

  generateActivationToken(id: string, email: string): string {
    const payload: IJwtActionPayload = {
      id,
      email,
      type: JwtActionEnum.ACTIVATION,
    };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  private generateResetToken(id: string, email: string): string {
    const payload: IJwtActionPayload = {
      id,
      email,
      type: JwtActionEnum.RESET_PASSWORD,
    };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }
}
