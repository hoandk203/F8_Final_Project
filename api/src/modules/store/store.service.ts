import { Injectable, Inject } from '@nestjs/common';
import { Repository } from "typeorm";
import { Store } from "./store.entity";
import { BaseService } from "../base/base.service";
import { Vendor } from "../vendor/vendor.entity";

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
}
