import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { CreateDto, UpdateDto } from './location.dto';

@Injectable()
export class LocationService {
    constructor(
        @Inject('LOCATION_REPOSITORY')
        private locationRepository: Repository<Location>,
    ) {}

    async create(createDto: CreateDto): Promise<Location> {
        const location = this.locationRepository.create(createDto);
        return this.locationRepository.save(location);
    }

    async findByDriverId(driverId: number): Promise<Location> {
        const location = await this.locationRepository.findOne({
            where: { driverId },
        });
        
        if (!location) {
            throw new NotFoundException(`Location for driver with ID ${driverId} not found`);
        }
        
        return location;
    }

    async update(driverId: number, updateDto: UpdateDto): Promise<Location> {
        // Tìm vị trí hiện tại của tài xế
        const location = await this.locationRepository.findOne({
            where: { driverId },
        });
        
        if (location) {
            // Nếu đã có vị trí, cập nhật
            await this.locationRepository.delete({ driverId });
        }
        
        // Tạo bản ghi mới với vị trí mới
        const newLocation = this.locationRepository.create({
            ...updateDto,
            driverId,
        });
        
        return this.locationRepository.save(newLocation);
    }

    async delete(driverId: number): Promise<void> {
        const result = await this.locationRepository.delete({ driverId });
        
        if (result.affected === 0) {
            throw new NotFoundException(`Location for driver with ID ${driverId} not found`);
        }
    }
}
