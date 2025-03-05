import {Body, Get, Post, Controller, Query, StreamableFile, BadRequestException} from '@nestjs/common';
import { ImageCreate } from './image.dto'
import {ImageService} from "./image.service";
import { createReadStream} from 'fs'

@Controller('image')
export class ImageController {
    constructor(private imageService: ImageService) {}

    @Get()
    getImg(@Query('path') path: string){
        const file= createReadStream(path)
        return new StreamableFile(file)
    }

    @Post()
    create(@Body() image: ImageCreate) {
        return this.imageService.create(image)
    }



}