import {Inject, Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import {BaseService} from "../base/base.service";
import {Repository} from "typeorm";
import {IdentityDocument} from "./entities/identity-document.entity";
import {CreateIdentityDto} from "./dto/create-identity.dto";
import {UpdateIdentityDto} from "./dto/update-identity.dto";
import { DriverService } from '../driver/driver.service';
import { ImageService } from '../image/image.service';

@Injectable()
export class IdentityDocumentService extends BaseService{
    constructor(
        @Inject('IDENTITY_DOCUMENT_REPOSITORY')
        private identityDocumentRepository: Repository<IdentityDocument>,
        private driverService: DriverService,
        private imageService: ImageService,
    ) {
        super(identityDocumentRepository)
    }

    async createIdentityDocument(data: CreateIdentityDto): Promise<IdentityDocument> {
        const frontImageUrl = await this.imageService.uploadBase64Image(data.frontImageUrl, 'identity');
        const backImageUrl = await this.imageService.uploadBase64Image(data.backImageUrl, 'identity');

        const identityDocument = this.identityDocumentRepository.create({
            userId: data.userId,
            frontImageUrl,
            backImageUrl,
            status: data.status,
        });

        return await this.identityDocumentRepository.save(identityDocument);
    }
    
    async updateIdentityDocument(id: number, data: any): Promise<IdentityDocument> {
        const identityDocument = await this.identityDocumentRepository.findOne({ where: { id } });
        
        let frontImageUrl = identityDocument.frontImageUrl;
        let backImageUrl = identityDocument.backImageUrl;

        if(identityDocument.frontImageUrl !== data.frontImageUrl){
            frontImageUrl = await this.imageService.uploadBase64Image(data.frontImageUrl, 'identity');
        }
        if(identityDocument.backImageUrl !== data.backImageUrl){
            backImageUrl = await this.imageService.uploadBase64Image(data.backImageUrl, 'identity');
        }

        await this.identityDocumentRepository.update(id, {
            frontImageUrl,
            backImageUrl,
            status: "pending",
            modifiedAt: new Date(),
        });

        return await this.identityDocumentRepository.findOne({ where: { id } });
    }

    async getOneByUserId(userId: number): Promise<IdentityDocument> {
        return await this.identityDocumentRepository.findOne({ where: { userId } });
    }

    async getOne(id: number): Promise<IdentityDocument> {
        const document = await this.identityDocumentRepository.findOne({
            where: { id },
        });

        if (!document) {
            throw new NotFoundException(`Identity document with ID ${id} not found`);
        }

        return document;
    }

    async adminUpdateStatus(id: number, updateIdentityDto: UpdateIdentityDto): Promise<any> {
        const document = await this.identityDocumentRepository.findOne({
            where: { id },
        });

        if (!document) {
            throw new NotFoundException(`Identity document with ID ${id} not found`);
        }

        try {
            await this.identityDocumentRepository.update(id, {
                ...updateIdentityDto,
                modifiedAt: new Date(),
            });

            return {
                success: true,
                message: 'Identity document updated successfully',
            };
        } catch (error) {
            console.log("update identity document",error)
            throw new BadRequestException('Failed to update identity document');
        }
    }

}
