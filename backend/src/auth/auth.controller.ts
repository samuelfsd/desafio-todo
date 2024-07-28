import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth.dto';

@Controller('authenticate')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  authenticate(
    @Body() authDto: Record<string, string>,
  ): Promise<AuthResponseDto> {
    return this.authService.auth(authDto.email, authDto.password);
  }
}
