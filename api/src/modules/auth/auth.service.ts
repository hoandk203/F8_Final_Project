import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import {RefreshTokenService} from "../refresh-token/refresh-token.service";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenService: RefreshTokenService
    ) {}

    async login(user: any){
        const uuid= uuidv4()
        const payload= {email: user.email, sub: user.id, uuid}
        const accessToken= this.jwtService.sign(payload)
        const refreshToken= this.jwtService.sign(payload, {expiresIn: '7d',})

        //decode de lay thoi gian het han
        const decoded= this.jwtService.decode(refreshToken)
        const expiresAt= new Date(decoded.exp * 1000)

        //hash
        const hashedRefreshToken= await bcrypt.hash(refreshToken, 10)

        // luu vao db
        await this.refreshTokenService.create(user.id, hashedRefreshToken, expiresAt, uuid)

        return{
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }

    async refreshToken(oldrefreshToken: string){
        //decode de lay userId
        const decoded= this.jwtService.decode(oldrefreshToken)
        if(!decoded || !decoded.sub){
            throw new UnauthorizedException('Invalid refresh token1')
        }
        const userId= decoded.sub
        const uuid= decoded.uuid;

        //lay refresh token cua user
        const tokenRecord= await this.refreshTokenService.findTokenByUuid(userId, uuid)
        if(!tokenRecord){
            throw new UnauthorizedException('Invalid refresh token2')
        }
        // dung bcrypt de kiem tra
        const isMatch= await bcrypt.compare(oldrefreshToken, tokenRecord.token)
        if(!isMatch){
            throw new UnauthorizedException('Invalid refresh token3')
        }

        //kiem tra thoi gian cua refresh token
        if(new Date() > tokenRecord.expiresAt){
            await this.refreshTokenService.deleteTokenById(tokenRecord.id)
            throw new UnauthorizedException('Refresh token expired')
        }

        //kiem tra lai key cua refresh token
        try {
            const payload= this.jwtService.verify(oldrefreshToken, {
                secret: "67941cd45fe6ebd906ed2f751aaf49dea7be39a590b562bb3f88aa2f6194a2c1"
            })

            // tao 2 token moi
            const newUuid= uuidv4()
            const newPayload= {email: payload.email, sub: payload.sub}
            const newAccessToken= this.jwtService.sign(newPayload)
            const newRefreshToken= this.jwtService.sign(newPayload, {expiresIn: '7d',})
            const decodedNew= this.jwtService.decode(newRefreshToken)
            const newExpiresAt= new Date(decodedNew.exp * 1000)

            //xoa refresh token cu va luu moi'
            await this.refreshTokenService.deleteTokenById(tokenRecord.id)
            const hashedNewRefreshToken= await bcrypt.hash(newRefreshToken, 10)
            await this.refreshTokenService.create(payload.sub, hashedNewRefreshToken, newExpiresAt, newUuid)

            return {
                access_token: newAccessToken,
                refresh_token: newRefreshToken
            }
        } catch(error){
            console.error('JWT Verify Error:', error);
            throw new UnauthorizedException('Invalid refresh token4')
        }
    }
}
