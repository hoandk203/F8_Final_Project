import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Vendor } from './vendor.entity';
import {BaseService} from "../base/base.service";

@Injectable()
export class VendorService extends BaseService{
    constructor(
        @Inject('VENDOR_REPOSITORY')
        private vendorRepository: Repository<Vendor>,
    ) {
        super(vendorRepository)
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
}
