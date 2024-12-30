import { Injectable, Inject } from '@nestjs/common';
import {Repository} from "typeorm";
import {Store} from "./entity";
import {BaseService} from "../base/base.service";
import {Vendor} from "../vendor/entity";

@Injectable()
export class StoreService extends BaseService{
  constructor(
      @Inject('STORE_REPOSITORY')
      private storeRepository: Repository<Store>,
  ) {
      super(storeRepository)
  }

    handleSelect(){
      return this.storeRepository
          .createQueryBuilder("store")
          .select([
              'store.*',
              'vendor.name as vendor_name',
          ])
          .innerJoin(Vendor, "vendor", "vendor.id = store.vendorId")
    }

    handleOrder(query){
        return query.orderBy("store.id", "DESC")
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

}
