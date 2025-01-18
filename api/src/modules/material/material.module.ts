import { Module } from '@nestjs/common';
import {MaterialController} from './material.controller';
import { MaterialService } from './material.service';
import {materialProviders} from "./material.providers";
import {DatabaseModule} from "../../database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [MaterialController],
  providers: [
    ...materialProviders,
    MaterialService
  ],
})
export class MaterialModule {}
