import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderDetail } from './order-detail.entity';
import {BaseService} from "../base/base.service";

@Injectable()
export class OrderDetailService extends BaseService{
    constructor(
        @Inject('ORDER_DETAIL_REPOSITORY')
        private orderDetailRepository: Repository<OrderDetail>,
    ) {
        super(orderDetailRepository)
    }

    handleSelect() {
        return this.orderDetailRepository
            .createQueryBuilder("order_detail")
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
