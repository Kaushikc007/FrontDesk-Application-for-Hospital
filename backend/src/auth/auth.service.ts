import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

export type ValidatedUser = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId?: string;
  role: string;
};

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    employeeId?: string;
    role: string;
  };
}

export interface JwtPayload {
  username: string;
  sub: number;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private convertUserToValidatedUser(user: User): ValidatedUser {
    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      employeeId: user.employeeId,
      role: user.role,
    };
  }

  async validateUser(
    emailOrUsername: string,
    password: string,
  ): Promise<ValidatedUser | null> {
    // Try to find user by email first, then by username
    let user = await this.usersService.findByEmail(emailOrUsername);
    if (!user) {
      user = await this.usersService.findByUsername(emailOrUsername);
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      return this.convertUserToValidatedUser(user);
    }
    return null;
  }

  login(user: ValidatedUser): LoginResponse {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role,
      },
    };
  }

  async validateJwtPayload(payload: JwtPayload): Promise<ValidatedUser> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.convertUserToValidatedUser(user);
  }

  async register(userData: Partial<User>): Promise<ValidatedUser> {
    const user = await this.usersService.create(userData);
    return this.convertUserToValidatedUser(user);
  }
}
