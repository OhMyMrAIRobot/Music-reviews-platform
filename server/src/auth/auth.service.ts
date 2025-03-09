import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { IJwtAuthPayload } from './types/jwt-auth-payload.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RolesService } from '../roles/roles.service';
import { plainToClass } from 'class-transformer';
import { UserRoleEnum } from '../roles/types/user-role.enum';
import { PrismaService } from '../prisma.service';
import { InvalidTokenException } from '../exceptions/invalid-token.exception';
import { IJwtActionPayload } from './types/jwt-action-payload.interface';
import { JwtActionEnum } from './types/jwt-action.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<UserResponseDto> {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return plainToClass(UserResponseDto, user);
  }

  async login(user: UserResponseDto) {
    const role = await this.rolesService.getRoleById(user.roleId);

    const validRole = Object.values(UserRoleEnum).includes(
      role.role as UserRoleEnum,
    )
      ? (role.role as UserRoleEnum)
      : UserRoleEnum.USER;

    const payload: IJwtAuthPayload = {
      id: user.id,
      email: user.email,
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

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const userRole = await this.rolesService.getRoleByName();

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
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

        return { user };
      });

      const token = this.generateActivationToken(
        result.user.id,
        result.user.email,
      );

      // send email

      return this.login(plainToClass(UserResponseDto, result.user));
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

  async resendActivationCode(user: IJwtAuthPayload) {
    const token = this.generateActivationToken(user.id, user.email);

    // send email

    return token;
  }

  generateActivationToken(id: string, email: string): string {
    const payload: IJwtActionPayload = {
      id,
      email,
      type: JwtActionEnum.ACTIVATION,
    };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  generateResetToken(id: string, email: string): string {
    const payload: IJwtActionPayload = {
      id,
      email,
      type: JwtActionEnum.RESET_PASSWORD,
    };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }
}
