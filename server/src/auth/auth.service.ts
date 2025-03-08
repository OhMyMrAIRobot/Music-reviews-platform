import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { JwtPayload } from './type/JwtPayload';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RolesService } from '../roles/roles.service';
import { plainToClass } from 'class-transformer';
import { UserRole } from '../roles/type/userRole';
import { PrismaService } from '../prisma.service';

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

    const validRole = Object.values(UserRole).includes(role.role as UserRole)
      ? (role.role as UserRole)
      : UserRole.USER;

    const payload: JwtPayload = {
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

      return this.login(plainToClass(UserResponseDto, result.user));
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(
        'Error occurred during user registration',
      );
    }
  }
}
