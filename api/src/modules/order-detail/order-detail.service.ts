import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderDetail } from './order-detail.entity';
import { BaseService } from "../base/base.service";
import { CreateDto } from './order-detail.dto';
import { Material } from '../material/material.entity';

@Injectable()
export class OrderDetailService extends BaseService {
    constructor(
        @Inject('ORDER_DETAIL_REPOSITORY')
        private orderDetailRepository: Repository<OrderDetail>,
    ) {
        super(orderDetailRepository);
    }

    handleSelect() {
        return this.orderDetailRepository
            .createQueryBuilder("order_detail")
            .select([
                '*'
            ])
            .where("active = :active", { active: true })
            .orderBy("created_at", "DESC")
    }

    async getByOrderId(orderId: number) {
        return this.orderDetailRepository.find({
            where: { orderId },
            order: { createdAt: 'DESC' },
        });
    }

    async create(createDto: any) {
        try {
            const orderDetail = await this.orderDetailRepository.save({
                ...createDto,
                createdAt: new Date(),
                modifiedAt: new Date()
            });

            return {
                success: true,
                message: 'Order detail created successfully',
                data: orderDetail
            };
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to create order detail');
        }
    }

    async deleteByOrderId(orderId: number) {
        return this.orderDetailRepository.update({ orderId }, { active: false, deletedAt: new Date() });
    }

    async findByOrderId(orderId: number) {
        try {
            console.log(`Finding order details for order ${orderId}`);
            
            const details = await this.orderDetailRepository
                .createQueryBuilder('order_detail')
                .select([
                    'order_detail.*',
                    'material.id as materialId',
                    'material.name as materialName',
                    'material.unit_price as materialPrice'
                ])
                .innerJoin(Material, 'material', 'material.id = order_detail.material_id')
                .where('order_detail.order_id = :orderId', { orderId })
                .andWhere('order_detail.active = :active', { active: true })
                .getRawMany();
                
            console.log(`Found ${details.length} order details for order ${orderId}`);
            
            // Chuyển đổi kết quả để phù hợp với cấu trúc mong muốn
            const formattedDetails = details.map(detail => ({
                ...detail,
                material: {
                    id: detail.materialId,
                    name: detail.materialName,
                    price: detail.materialPrice
                }
            }));
            
            return formattedDetails;
        } catch (error) {
            console.error(`Error finding order details for order ${orderId}:`, error);
            return [];
        }
    }
}
