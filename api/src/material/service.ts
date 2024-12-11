import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Material } from './entity';
import {BaseService} from "../base/base.service";

@Injectable()
export class MaterialService extends BaseService{
  constructor(
      @Inject('MATERIAL_REPOSITORY')
      private materialRepository: Repository<Material>,
  ) {
    super(materialRepository)
  }

  handleSelect() {
    return this.materialRepository
      .createQueryBuilder("material")
      .select([
        '*'
      ])
  }

  // async findAll(){
  //   return this.vendorRepository
  //     .createQueryBuilder("vendor")
  //     .select([
  //         'vendor.id as id',
  //         'vendor.name as name',
  //     ])
  //     .where({active: true})
  //     .getRawMany()
  // }

  // getOne(id: number) {
  //   return "getOne"
  // }
  //
  // create(vendor) {
  //   return "create"
  // }
  //
  // update(id: number, vendor) {
  //   return "update"
  // }
  //
  // delete(id: number) {
  //   return "delete"
  // }
}
