import { Module } from '@nestjs/common';
// import { UsersController } from './users.controller';
import {DatabaseModule} from "../../database.module";

import {OtpService} from "./otp.service";
import {otpProviders} from "./otp.provider";


@Module({
  imports: [
      DatabaseModule
  ],
  // controllers: [UsersController],
  providers: [
      ...otpProviders,
      OtpService
  ],
    exports:[OtpService]
})
export class OtpModule {}
