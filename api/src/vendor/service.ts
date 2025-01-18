import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Vendor } from './entity';
import {BaseService} from "../base/base.service";

@Injectable()
export class VendorService extends BaseService{
  constructor(
      @Inject('VENDOR_REPOSITORY')
      private vendorRepository: Repository<Vendor>,
  ) {
    super(vendorRepository)
  }

  handleSelect() {
    return this.vendorRepository
      .createQueryBuilder("vendor")
      .select([
        '*'
      ])
  }

  searchByName(name: string) {
    const query = this.vendorRepository
        .createQueryBuilder("vendor")
        .select([
          '*'
        ])
        .where("lower(vendor.name) LIKE :name", { name: `%${name.toLowerCase()}%` })
        .andWhere("vendor.active = :active", { active: true })
        .orderBy("vendor.id", "DESC");

    return query.getRawMany();
  }
}
