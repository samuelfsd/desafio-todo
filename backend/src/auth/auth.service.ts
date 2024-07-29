import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compareSync } from 'bcryptjs';

import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async auth(email: string, pass: string): Promise<AuthResponseDto> {
    const user = await this.usersService.findOne(email);

    if (!user || !compareSync(pass, user.password)) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.email };

    const token = this.jwtService.sign(payload);

    delete user.password
    return { token, user };
  }
}
