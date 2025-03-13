import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StoreLocation } from './store-location.entity';
import { CreateDto, UpdateDto } from './store-location.dto';

@Injectable()
export class StoreLocationService {
    constructor(
        @Inject('STORE_LOCATION_REPOSITORY')
        private storeLocationRepository: Repository<StoreLocation>,
    ) {}

    async findAll() {
        try {
            console.log('Finding all store locations');
            const locations = await this.storeLocationRepository.find();
            console.log(`Found ${locations.length} store locations`);
            return locations;
        } catch (error) {
            console.error('Error finding store locations:', error);
            return [];
        }
    }

    async create(createDto: any) {
        const location = this.storeLocationRepository.create(createDto);
        return this.storeLocationRepository.save(location);
    }

    async findByStoreId(storeId: number): Promise<StoreLocation> {
        const location = await this.storeLocationRepository.findOne({
            where: { storeId },
        });
        
        if (!location) {
            throw new NotFoundException(`Location for store with ID ${storeId} not found`);
        }
        
        return location;
    }

    async update(latitude: number, longitude: number, updateDto: UpdateDto): Promise<StoreLocation> {
        const location = await this.storeLocationRepository.findOne({
            where: { latitude, longitude },
        });
        
        if (!location) {
            throw new NotFoundException(`Location with latitude ${latitude} and longitude ${longitude} not found`);
        }
        
        Object.assign(location, updateDto);
        return this.storeLocationRepository.save(location);
    }

    async delete(latitude: number, longitude: number): Promise<void> {
        const result = await this.storeLocationRepository.delete({ latitude, longitude });
        
        if (result.affected === 0) {
            throw new NotFoundException(`Location with latitude ${latitude} and longitude ${longitude} not found`);
        }
    }
}
