import {Body, Controller, Get, Post, Res} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import {Response} from "express";
import {ResetDto} from "./dto/reset.dto";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post("/signup")
  async signup(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @Post("/signin")
  async signin(@Body() dto: AuthDto,
               @Res() res: Response) {
    return this.authService.signIn(dto, res);
  }

  @Post("/recover")
  async recover(@Body() dto: ResetDto,
                @Res() res: Response) {
    return this.authService.resetPassword(dto, res);
  }

  @Get("/refresh")
  refresh() {}
  /** na chwilę obecną nie mam na to pomysłu */

  @Get("/logout")
  async logOut() {}

}