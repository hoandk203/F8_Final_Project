import { Module } from '@nestjs/common';
import {ImageController} from './image.controller';
import {ImageService} from './image.service';
import {DatabaseModule} from "../../database.module";
import {imageProviders} from "./image.providers";
// import {} from "./vendor.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [ImageController],
  providers: [
    ...imageProviders,
    ImageService
  ],
})

export class ImageModule {}
