import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {DatabaseModule} from "../../database.module";
import {userProviders} from "./users.provider";
import {MailerModule} from "@nestjs-modules/mailer";

const HOST= 'smtp.gmail.com';
const PORT= 465;
const SENDER= 'hoanyttv@gmail.com';
const PASSWORD= 'evcwguimlleukamy';

@Module({
  imports: [
      DatabaseModule,
      MailerModule.forRoot({
          transport: {
              host: HOST,
              port: PORT,
              secure: true,
              auth: {
                  user: SENDER,
                  pass: PASSWORD
              }
          }
      }),
  ],
  controllers: [UsersController],
  providers: [
      ...userProviders,
      UsersService
  ],
})
export class UsersModule {}
