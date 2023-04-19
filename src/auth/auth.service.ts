import {  Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
  ) {}

  /** zamiast ANY wstawimy tam nazwe z entity. Np User, Student czy jak to sobie nazwiemy  */

  async signup(authDto: AuthDto):Promise<any> {

  }

  async signin(authDto: AuthDto)

}