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


}
