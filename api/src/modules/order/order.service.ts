import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import {BaseService} from "../base/base.service";

@Injectable()
export class OrderService extends BaseService{
    constructor(
        @Inject('ORDER_REPOSITORY')
        private orderRepository: Repository<Order>,
    ) {
        super(orderRepository)
    }

    handleSelect() {
        return this.orderRepository
            .createQueryBuilder("order")
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
