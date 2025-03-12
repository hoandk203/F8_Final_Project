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
        console.log(user);
        
        const uuid= uuidv4()
        const payload= {email: user.email, sub: user.id, uuid}
        const accessToken= this.jwtService.sign(payload)
        const refreshToken= this.jwtService.sign(payload, {expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,})

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

    async refreshToken(oldRefreshToken: string){
        //decode de lay userId
        const decoded= this.jwtService.decode(oldRefreshToken)
        if(!decoded || !decoded.sub){
            throw new UnauthorizedException('Invalid refresh token1')
        }
        const userId= decoded.sub
        const uuid= decoded.uuid;

        //lay refresh token cua user
        const tokenRecord= await this.refreshTokenService.findTokenByUuid(userId, uuid)
        if(!tokenRecord){
            throw new UnauthorizedException('Invalid refresh token, token not found')
        }
        // dung bcrypt de kiem tra
        const isMatch= await bcrypt.compare(oldRefreshToken, tokenRecord.token)
        if(!isMatch){
            throw new UnauthorizedException('Invalid refresh token, token not match')
        }

        //kiem tra thoi gian cua refresh token
        if(new Date() > tokenRecord.expiresAt){
            await this.refreshTokenService.deleteTokenById(tokenRecord.id)
            throw new UnauthorizedException('Refresh token expired')
        }

        //kiem tra lai key cua refresh token
        try {
            const payload= this.jwtService.verify(oldRefreshToken, {
                secret: process.env.JWT_SECRET,
            })

            // tao 2 token moi
            const newUuid= uuidv4()
            const newPayload= {email: payload.email, sub: payload.sub, uuid: newUuid}
            const newAccessToken= this.jwtService.sign(newPayload)
            const newRefreshToken= this.jwtService.sign(newPayload, {expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,})
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
    
    async logout(userId: number, refreshToken: string): Promise<{ success: boolean }> {
        try {
            // Giải mã refresh token để lấy UUID
            const decoded = this.jwtService.decode(refreshToken);
            if (!decoded || !decoded.uuid) {
                return { success: false };
            }
            
            const uuid = decoded.uuid;
            
            // Xóa refresh token từ database
            await this.refreshTokenService.deleteTokenByUuid(userId, uuid);
            
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false };
        }
    }
}
