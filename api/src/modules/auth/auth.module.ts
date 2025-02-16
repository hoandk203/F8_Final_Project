import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "../../passport/local.strategy";
import {JwtStrategy} from "../../passport/jwt.strategy";

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
      UsersModule,
      PassportModule,
      JwtModule.register({
        secret: "67941cd45fe6ebd906ed2f751aaf49dea7be39a590b562bb3f88aa2f6194a2c1",
        signOptions: {expiresIn: '30s'}
      })
  ],
})
export class AuthModule {}
