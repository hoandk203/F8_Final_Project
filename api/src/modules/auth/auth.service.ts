import {Injectable, UnauthorizedException, BadRequestException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import {RefreshTokenService} from "../refresh-token/refresh-token.service";
import { v4 as uuidv4 } from 'uuid';
import { OtpService } from '../email-verification/otp.service';
import { MailerService } from '@nestjs-modules/mailer';
import { StoreService } from '../store/store.service';
import { VendorService } from '../vendor/vendor.service';
import { DriverService } from '../driver/driver.service';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly storeService: StoreService,
        private readonly vendorService: VendorService,
        private readonly driverService: DriverService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly otpService: OtpService,
        private readonly mailerService: MailerService
    ) {}

    async login(user: any){
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
            refresh_token: refreshToken,
            role: user.role
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

    async changePassword(userId: number, oldPassword: string, newPassword: string) {
        // Lấy thông tin user từ database
        const user = await this.userService.getOne(userId);
        console.log(user);
        
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Kiểm tra mật khẩu cũ
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        // Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
        if (oldPassword === newPassword) {
            throw new BadRequestException('New password must be different from the current password');
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới vào database
        await this.userService.updatePassword(userId, hashedPassword);

        return {
            success: true,
            message: 'Password changed successfully'
        };
    }

    async resetPassword(data: any) {
        const user= await this.userService.getByEmail(data.email)
        const userId= user.id
    
        const validateOtp= await this.otpService.validateOtp(data.email, data.otp)
    
        if(validateOtp){
            const passwordRandom = Math.random().toString(36).slice(-8) + "@Scrap1";
            await this.mailerService.sendMail({
              from: "hoanyttv@gmail.com",
              to: data.email,
              subject: "Password for Scrap Plan",
              html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
        
                    .wrapper{
                        margin: 0 auto;
                        background-color: rgb(33, 36, 41);
                        padding: 50px;
                        width: 700px;
                    }
        
                    .container {
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        font-size: 16px;
                    }
                    p {
                        color: #555555;
                        line-height: 1.6;
                    }
                    .otp-code {
                        font-size: 24px;
                        margin: 20px 0;
                    }
                    .note {
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <div class="container">
                        <p class="dear">Dear ${data.email},</p>
                        <div class="otp-code">Your Password: <b>${passwordRandom}</b></div>
                        <p class="note">Thank you for using our service.</p>
                    </div>
                </div>
            </body>
            </html>
          `
            })
    
          
          
          //hash password
          data.password  = await bcrypt.hash(passwordRandom, 10);
          await this.userService.resetPassword(userId, data.password)
    
          return {...data, role: user.role}
        }
    
        throw new UnauthorizedException('Invalid OTP code');
      }

      async updateProfile(user: any, data: any) {
        const userInfo= await this.userService.getOne(user.id)
          try {
              if(userInfo.role === 'store'){
                  const store= await this.storeService.getStoreIdByUserId(userInfo.id)
                  if(store){
                      await this.storeService.updateOne(store.id, {...data, modifiedAt: new Date()})
                  }
              }
              if(userInfo.role === 'vendor'){
                  const vendor= await this.vendorService.getVendorbyUserId(userInfo.id)
                  if(vendor){
                      await this.vendorService.updateOne(vendor.id, {...data, modifiedAt: new Date()})
                  }
              }
              if(userInfo.role === 'driver'){
                  const driver= await this.driverService.getByUserId(userInfo.id)
                  if(driver){
                      await this.driverService.update(driver.id, {
                          fullname: data.fullname,
                          phoneNumber: data.phone_number,
                          dateOfBirth: data.date_of_birth,
                          gstNumber: data.gst_number,
                          address: data.address,
                          city: data.city,
                          country: data.country
                      })
                  }
              }
          }catch (e) {
              throw new BadRequestException(e.message)
          }

        
      }
}
