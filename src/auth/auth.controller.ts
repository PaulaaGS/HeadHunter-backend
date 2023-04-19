import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post("/signup")
  signup(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @Post("/signin")
  signin(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @Get("/refresh")
  refresh() {}
  /** na chwilę obecną nie mam na to pomysłu */

}