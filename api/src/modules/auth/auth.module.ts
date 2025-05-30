import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "../../passport/local.strategy";
import {JwtStrategy} from "../../passport/jwt.strategy";
import {RefreshTokenModule} from "../refresh-token/refresh-token.module";
import {ConfigModule} from "@nestjs/config";
import {DriverModule} from "../driver/driver.module";
import { StoreModule } from '../store/store.module';
import {VendorModule} from "../vendor/vendor.module";
import { OtpModule } from '../email-verification/otp.module';
import { IdentityDocumentModule } from '../identity-document/identity-document.module';
import { VehicleModule } from '../vehicle/vehicle.module';
@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
      ConfigModule.forRoot(),
      UsersModule,
      DriverModule,
      StoreModule,
      VendorModule,
      OtpModule,
      IdentityDocumentModule,
      VehicleModule,
      RefreshTokenModule,
      PassportModule,
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME}
      })
  ],
})
export class AuthModule {}
