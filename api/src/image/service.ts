import {Inject, Injectable} from "@nestjs/common";
import { v4 } from 'uuid';
import {Repository} from "typeorm";
import {Image} from "./entity";
import {BaseService} from "../base/base.service";
import {writeFile} from 'fs'

@Injectable()
export class ImageService extends BaseService {
    constructor(
        @Inject('IMAGE_REPOSITORY')
        private imageRepository: Repository<Image>,
    ) {
        super(imageRepository)
    }

    async create(image) {

        const payload= image.payload.split(',')[1]
        const path= `images/${v4()}.png`

        await writeFile(path, payload, 'base64', (e) => {
            console.log(e)
        })

        const newImg= super.create({
            path: path,
            url: null
        })

        return newImg
    }
}