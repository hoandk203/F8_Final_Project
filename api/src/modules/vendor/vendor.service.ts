import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Vendor } from './vendor.entity';
import { BaseService } from "../base/base.service";
import { CreateDto } from './vendor.dto';

@Injectable()
export class VendorService extends BaseService{
    constructor(
        @Inject('VENDOR_REPOSITORY')
        private vendorRepository: Repository<Vendor>,
    ) {
        super(vendorRepository)
    }

    async create(data: CreateDto) {
        // Check if vendor with this email already exists
        const existingVendor = await this.vendorRepository.findOne({
            where: { email: data.email }
        });

        if (existingVendor) {
            throw new ConflictException('Vendor with this email already exists');
        }

        // Create new vendor
        const vendor = this.vendorRepository.create({
            name: data.name,
            email: data.email,
            userId: data.userId
        });

        return this.vendorRepository.save(vendor);
    }

    async getList() {
        return this.vendorRepository
            .createQueryBuilder("vendor")
            .select([
                'vendor.*',
            ])
            .where("vendor.active = :active", {active: true})
            .orderBy("vendor.id", "DESC")
            .getRawMany();
    }

    handleOrder(query) {
        return query.orderBy("vendor.id", "DESC");
    }

    searchByName(name: string) {
        const query = this.vendorRepository
            .createQueryBuilder("vendor")
            .select([
                'vendor.*',
            ])
            .where("lower(vendor.name) LIKE :name", { name: `%${name.toLowerCase()}%` })
            .andWhere("vendor.active = :active", { active: true })
            .orderBy("vendor.id", "DESC");

        return query.getRawMany();
    }

    async getVendorListForStore() {
        const vendors: any = await this.vendorRepository
            .createQueryBuilder("vendor")
            .select([
                'vendor.id',
                'vendor.name',
            ])
            .where("vendor.active = :active", { active: true })
            .orderBy("vendor.name", "ASC")
            .getMany();

        return vendors;
    }

    async getByEmail(email: string) {
        return this.vendorRepository
            .createQueryBuilder("vendor")
            .select([
                'vendor.*',
            ])
            .where("vendor.email = :email", {email})
            .getRawOne();
    }

    async getVendorbyUserId(userId: number) {
        return this.vendorRepository
            .createQueryBuilder("vendor")
            .where("vendor.user_id = :userId", {userId})
            .getOne();
    }
}
