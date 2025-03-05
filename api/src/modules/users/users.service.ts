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
    const {email, resend}= data

    //check email already exist
    if(!resend){
      const userExist = await this.userRepository.findOne({ where: { email } });
      if (userExist) {
        throw new ConflictException('Email already registered');
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
    const {email, password}= data

    const userExist= await this.userRepository.findOne({where: {email}})
    if(userExist){
      throw new ConflictException('Email already registered')
    }

    const validateOtp= await this.otpService.validateOtp(data.email, data.otp)

    if(validateOtp){
      //hash password
      data.password  = await bcrypt.hash(password, 10);

      await this.repository
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

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
