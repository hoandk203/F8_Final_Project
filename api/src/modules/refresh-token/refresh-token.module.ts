import { Module } from '@nestjs/common';
import {DatabaseModule} from "../../database.module";
import {refreshTokenProviders} from "./refresh-token.providers";
import {RefreshTokenService} from "./refresh-token.service";

@Module({
  imports: [DatabaseModule],
  // controllers: [],
  providers: [
    ...refreshTokenProviders,
    RefreshTokenService
  ],
  exports: [RefreshTokenService]
})

export class RefreshTokenModule {}
