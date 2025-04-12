import { Injectable, Inject } from '@nestjs/common';
import { Repository } from "typeorm";
import { Store } from "./store.entity";
import { BaseService } from "../base/base.service";
import { Vendor } from "../vendor/vendor.entity";
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class StoreService extends BaseService {
    constructor(
        @Inject('STORE_REPOSITORY')
        private storeRepository: Repository<Store>,
    ) {
        super(storeRepository);
    }

    async getList() {
        return this.storeRepository
            .createQueryBuilder("store")
            .leftJoinAndSelect("vendor", "vendor", "store.vendor_id = vendor.id")
            .select([
                'store.*',
                'vendor.name as vendor_name',
            ])
            .where("store.active = :active", {active: true})
            .orderBy("store.id", "DESC")
            .getRawMany();
    }

    async create(store: any) {
        return this.storeRepository.save(store);
    }

    async updateOne(id: number, data: any) {
        try {
            // Cập nhật dữ liệu
            await this.storeRepository.update(id, {
                ...data,
                modifiedAt: new Date()
            });
            
            // Trả về kết quả cập nhật
            const updatedStore = await this.storeRepository
            .createQueryBuilder("store")
            .select([
                "store.*"
            ])
            .where("store.id = :id", { id })
            .getRawOne();

            return updatedStore;
        } catch (error) {
            console.error('Error updating store:', error);
            throw new BadRequestException('Failed to update store');
        }
    }

    handleOrder(query) {
        return query.orderBy("store.id", "DESC");
    }

    searchByName(name: string) {
        const query = this.storeRepository
            .createQueryBuilder("store")
            .select([
                'store.*',
                'vendor.name as vendor_name',
            ])
            .innerJoin(Vendor, "vendor", "vendor.id = store.vendorId")
            .where("lower(store.name) LIKE :name", { name: `%${name.toLowerCase()}%` })
            .andWhere("store.active = :active", { active: true })
            .orderBy("store.id", "DESC");

        return query.getRawMany();
    }

    async getByEmail(email: string) {
        return this.storeRepository
            .createQueryBuilder("store")
            .select([
                'store.*',
                'vendor.name as vendor_name',
            ])
            .innerJoin(Vendor, "vendor", "vendor.id = store.vendorId")
            .where("store.email = :email", {email})
            .getRawOne();
    }

    async getStoreIdByUserId(userId: number) {
        return this.storeRepository
            .createQueryBuilder("store")
            .where("store.user_id = :userId", {userId})
            .getOne();
    }

    async getStoreById(storeId: number) {
        return this.storeRepository
            .createQueryBuilder("store")
            .where("store.id = :storeId", {storeId})
            .getOne();
    }

    async getStoresByVendorId(vendorId: number) {
        try {
            return this.storeRepository
            .createQueryBuilder("store")
            .select([
                "store.*",
            ])
            .where("store.vendor_id = :vendorId", {vendorId})
            .andWhere("store.active = :active", {active: true})
            .getRawMany();
        } catch (error) {
            console.error('Error getting stores by vendor ID:', error);
            throw new BadRequestException('Failed to get stores by vendor ID');
        }
    }
}
