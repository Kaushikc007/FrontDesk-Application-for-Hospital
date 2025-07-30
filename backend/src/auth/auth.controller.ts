import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, LoginResponse, ValidatedUser } from './auth.service';
import { RegisterDto } from './dto/register.dto';

interface AuthenticatedRequest extends Request {
  user: ValidatedUser;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: AuthenticatedRequest): LoginResponse {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ValidatedUser> {
    // For now, this will create a front desk user
    return await this.authService.register(registerDto);
  }
}
