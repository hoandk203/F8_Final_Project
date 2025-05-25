import {ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import {BaseService} from "../base/base.service";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {MailerService} from "@nestjs-modules/mailer";
import {OtpService} from "../email-verification/otp.service";


@Injectable()
export class UsersService extends BaseService{
  constructor(
      @Inject('USER_REPOSITORY')
      private userRepository: Repository<User>,
      private mailerService: MailerService,
      private otpService: OtpService
  ) {
    super(userRepository)
  }

  // SEND MAIL
  async sendMail(data: any) {
    const {email, resend, changePassword}= data
    //check email already exist
    if(!resend && !changePassword){
      const userExist = await this.userRepository.findOne({ where: { email } });
      if (userExist) {
        throw new ConflictException('Email already registered');
      }
    }
    if(changePassword){
      const userExist = await this.userRepository.findOne({ where: { email } });
      if (!userExist) {
        throw new ConflictException('Email not exist');
      }
    }


    //goi generate otp tu OtpService
    const otpCode= await this.otpService.generateOtp(email)
    await this.mailerService.sendMail({
      from: "hoanyttv@gmail.com",
      to: email,
      subject: "Verify email - Scrap website",
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Email</title>
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
                <p class="dear">Dear ${email},</p>
                <div class="otp-code">Your OTP code: <b>${otpCode}</b></div>
                <p class="note">OTP code is valid for 5 minutes</p>
                <p>Thanks.</p>
            </div>
        </div>
    </body>
    </html>
  `
    })
    return 'Mail has been sent'
  }

  // CREATE USER
  async create(data: any) {
    const {email, password, role, name}= data
    
    const userExist= await this.userRepository.findOne({where: {email}})
    if(userExist){
      throw new ConflictException('Email already registered')
    }

    const validateOtp= await this.otpService.validateOtp(data.email, data.otp)

    if(validateOtp){
      if(role === "store"){
        const passwordRandom = Math.random().toString(36).slice(-8) + "@Scrap1";
        data.password = passwordRandom;
        await this.mailerService.sendMail({
          from: "hoanyttv@gmail.com",
          to: email,
          subject: "Password for Scrap Plan",
          html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Scrap Plan</title>
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
                    <p class="dear">Dear ${email},</p>
                    <div class="otp-code">Your Password: <b>${passwordRandom}</b></div>
                    <p class="note">Thank you for registering with us.</p>
                </div>
            </div>
        </body>
        </html>
      `
        })
      }
      
      //hash password
      data.password = await bcrypt.hash(data.password, 10);

      // Validate name field for vendor
      if(role === 'vendor' && !name) {
        throw new Error('Name is required for vendor role');
      }

      // Remove name field if role is not vendor
      if(role !== 'vendor') {
        delete data.name;
      }

      const user = await this.repository
          .createQueryBuilder()
          .insert()
          .values(data)
          .execute()

      return data
    }

    throw new UnauthorizedException('Invalid OTP code');
  }

  handleSelect() {
    return this.userRepository
        .createQueryBuilder("users")
        .select([
            'users.*'
        ])
  }

  async adminCreate(data: any) {
    const {email, password, role}= data

    const userExist= await this.userRepository.findOne({where: {email}})
    if(userExist){
      throw new ConflictException('Email already registered')
    }

    data.password  = await bcrypt.hash(data.password, 10);

    await this.userRepository.save(data)
  }

  async adminGetList() {
    return this.userRepository.find({
      where: {
        role: 'admin'
      }
    })
  }

  // LOGIN
  async validateUser(email: string, password: string) {
    //check user exist
    const user= await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //compare hash password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return user
  }

  getByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateStoreUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ 
      where: { 
        email
      } 
    });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async updatePassword(userId: number, hashedPassword: string) {
    return this.userRepository.update(
        { id: userId },
        { 
            password: hashedPassword,
            modifiedAt: new Date()
        }
    );
  }

  async resetPassword(userId: number, password: string) {
    await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({password, modifiedAt: new Date()})
        .where("id = :userId", {userId})
        .execute()
    
    
  }
}
