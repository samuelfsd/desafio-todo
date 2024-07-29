import { User } from "@prisma/client";

export class AuthResponseDto {
  token: string;
  user: User;
}
