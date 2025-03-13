import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Material } from './material.entity';
import { BaseService } from "../base/base.service";
import { CreateDto, UpdateDto } from './material.dto';

@Injectable()
export class MaterialService extends BaseService {
    constructor(
        @Inject('MATERIAL_REPOSITORY')
        private materialRepository: Repository<Material>,
    ) {
        super(materialRepository);
    }

    async getOne(id: number) {
        return this.materialRepository.findOne({ where: { id, active: true } });
    }

    async create(createDto: any) {
        try {
            const material = await this.materialRepository.save({
                ...createDto,
                createdAt: new Date(),
                modifiedAt: new Date()
            });

            return {
                success: true,
                message: 'Material created successfully',
                data: material
            };
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to create material');
        }
    }

    async update(id: number, updateDto: any) {
        const material = await this.materialRepository.findOne({ where: { id } });
        if (!material) {
            throw new BadRequestException('Material not found');
        }

        return this.materialRepository.update(id, {
            ...updateDto,
            modifiedAt: new Date()
        });
    }

    async delete(id: number) {
        const material = await this.materialRepository.findOne({ where: { id } });
        if (!material) {
            throw new BadRequestException('Material not found');
        }

        return this.materialRepository.update(id, { active: false, deletedAt: new Date() });
    }

    handleSelect() {
        return this.materialRepository
            .createQueryBuilder("material")
            .select([
                '*'
            ])
    }
}
