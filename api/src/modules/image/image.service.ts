import {Inject, Injectable, BadRequestException} from "@nestjs/common";
import {v4} from 'uuid';
import {Repository} from "typeorm";
import {Image} from "./image.entity";
import {BaseService} from "../base/base.service";
import {writeFile} from 'fs'
import {ImageCreate} from "./image.dto";
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ImageService extends BaseService {
    private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    constructor(
        @Inject('IMAGE_REPOSITORY')
        private imageRepository: Repository<Image>,
    ) {
        super(imageRepository)
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    private validateBase64Image(base64String: string): string {
        // Kiểm tra format base64 image
        const base64Regex = /^data:image\/(jpeg|png|jpg);base64,/;
        if (!base64Regex.test(base64String)) {
            throw new BadRequestException('Invalid image format. Must be a base64 encoded image (JPEG, PNG, or JPG)');
        }

        // Tách phần payload
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        
        // Kiểm tra kích thước
        const fileSize = (base64Data.length * 3) / 4;
        if (fileSize > this.MAX_FILE_SIZE) {
            throw new BadRequestException(`Image size too large. Maximum size is ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`);
        }

        return base64String;
    }

    async uploadBase64Image(base64Image: string, folder: string): Promise<string> {
        try {
            // Validate base64 image
            this.validateBase64Image(base64Image);

            // Upload lên Cloudinary với các options tối ưu
            const result = await cloudinary.uploader.upload(base64Image, {
                folder: `scrap_plan/${folder}`,
                resource_type: 'auto',
                quality: 'auto', // Tự động tối ưu chất lượng
                fetch_format: 'auto', // Tự động chọn format phù hợp
                width: 1000, // Giới hạn kích thước tối đa
                crop: 'limit',
                flags: 'lossy', // Cho phép nén lossy để giảm dung lượng
                transformation: [
                    {quality: 'auto:good'} // Cân bằng giữa chất lượng và dung lượng
                ]
            });
            
            return result.secure_url;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error('Error uploading to Cloudinary:', error);
            throw new BadRequestException('Failed to upload image: ' + error.message);
        }
    }
}