import {Injectable} from '@nestjs/common';
import {AuthDto} from "./dto/auth.dto";
import {User} from "./auth.entity";
import {v4 as uuid} from 'uuid';
import {Jwt} from "./jwt.strategy";
import {sign} from 'jsonwebtoken';
import {hashPwd} from "../utils/hashPwd";
import {Response} from "express";
import {ResetDto} from "./dto/reset.dto";


@Injectable()
export class AuthService {

    private createToken(createTokenId: string): {
        accessToken: string;
        expiresIn: number;
    } {
        const payLoad: Jwt = {id: createTokenId};
        const expiresIn = 60 * 60 * 24;
        const accessToken = sign(
            payLoad,
            'nextekeyjioj*(HJ$!)$H!)$H)!$%!&)(*#@IJKNM!QASXCVNM<>LKJHGFDSAQWERTYUIOP{+_)(*&^%$#@!!!!QWERTYUIO)_{::::><M?ukryć',
            {expiresIn},
        );
        return {
            accessToken,
            expiresIn,
        };
    }

    private async generateToken(user: User): Promise<string> {
        let token;
        let userWithThisToken = null;
        do {
            token = uuid();
            userWithThisToken = await User.findOneBy({accessToken: token});
        } while (!!userWithThisToken);
        user.accessToken = token;
        await user.save();

        return token;
    }


    /** zamiast ANY wstawimy tam nazwe z entity. Np User, Student czy jak to sobie nazwiemy  */

    async signUp(authDto: AuthDto): Promise<any> {
        const user = new User();
        user.email = authDto.email;
        user.passwordHash = hashPwd(authDto.password);
        console.log(user);
        await user.save();
        const { email, id } = user;
        return { id, email };
    }

    async signIn(authDto: AuthDto, res: Response) {
        try {
            const user = await User.findOneBy({
                email: authDto.email,
                passwordHash: hashPwd(authDto.password),
            });
            if (!user) {
                return res.json({message: 'Invalid signIn data'})
            }
            const token = await this.createToken(await this.generateToken(user));
            console.log(token);
            console.log(user);
            return res
                .cookie('jwt', token.accessToken, {
                    secure: false, //tu ustawiamy true jeśli jest https (czyli na produkcji)
                    domain: 'localhost', //tu domenę
                    httpOnly: true, //dzięki temu front nie widzi ciastek jwt
                    sameSite: 'lax',
                })
                .json({message: 'Login successful.'});
        } catch (e) {
            return res.json({message: e.message});
        }
    }

    async resetPassword(resetDto: ResetDto, res: Response) {
        try {
            console.log(resetDto.token);
            const user = await User.findOneBy({
                accessToken: resetDto.token,
            });
            if (!user) {
                return res.json({message: 'Incorrect data'})
            }
            console.log(user);
            user.passwordHash = hashPwd(resetDto.password);
            await user.save();
            const { email, id } = user;
            return { id, email };
        }catch (e) {
            return res.json({message: e.message});
        }
    }

}