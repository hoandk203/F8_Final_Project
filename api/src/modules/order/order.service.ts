import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Brackets, createQueryBuilder, Repository } from 'typeorm';
import { Order } from './order.entity';
import { BaseService } from "../base/base.service";
import { CreateDto, UpdateDto } from './order.dto';
import { OrderDetailService } from '../order-detail/order-detail.service';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { promisify } from 'util';
import { MaterialService } from '../material/material.service';
import { OrderDetail } from '../order-detail/order-detail.entity';
import { StoreLocationService } from '../store-location/store-location.service';
import { Store } from '../store/store.entity';
import { DataSource } from 'typeorm';
import { StoreService } from '../store/store.service';
import { In } from 'typeorm';
import { DriverService } from '../driver/driver.service';
import {Payment} from "../payment/entities/payment.entity";

const writeFileAsync = promisify(fs.writeFile);

@Injectable()
export class OrderService extends BaseService {
    constructor(
        @Inject('ORDER_REPOSITORY')
        private orderRepository: Repository<Order>,
        private storeLocationService: StoreLocationService,
        private orderDetailService: OrderDetailService,
        private materialService: MaterialService,
        private storeService: StoreService,
        private driverService: DriverService,
    ) {
        super(orderRepository);
    }

    async findAllByVendorId(vendorId: number) {
        
        try {
            // Lấy tất cả các cửa hàng thuộc vendor bằng storeService
            const stores = await this.storeService.getStoresByVendorId(vendorId);
            if (!stores || stores.length === 0) {
                return [];
            }
            
            const storeIds = stores.map(store => store.id);
            
            // Lấy tất cả đơn hàng của các cửa hàng này
            const orders = await this.orderRepository.find({
                where: { 
                    storeId: In(storeIds),
                    active: true
                },
                order: { createdAt: 'DESC' }
            });
            
            // Lấy chi tiết đơn hàng song song
            const ordersWithDetails = await Promise.all(
                orders.map(async (order) => {
                    const orderDetail = await this.orderDetailService.findByOrderId(order.id);
                    return {
                        ...order,
                        orderDetail
                    };
                })
            );
            
            return ordersWithDetails;
        } catch (error) {
            console.error('Error getting vendor orders:', error);
            throw new BadRequestException('Failed to get vendor orders');
        }
    }

    async adminGetAll(){
        return this.orderRepository
        .createQueryBuilder("orders")
        .select([
            'orders.*',
            'orderDetail.weight',
        ])
        .innerJoin(OrderDetail, "orderDetail", "orderDetail.order_id = orders.id")
        .where('orders.active = :active', { active: true })
        .orderBy('orders.createdAt', 'DESC')
        .getRawMany();
    }

    async getOrderById(id: number) {
        const oneOrder= await this.orderRepository.findOne({ where: { id } });
        const store= await this.storeService.getStoreById(oneOrder.storeId)
        const orderDetails= await this.orderDetailService.findByOrderId(id)
        return {
            ...oneOrder,
            store,
            orderDetails
        }

    }

    async getOrdersByStoreId(storeId: number) {
        return this.orderRepository
        .createQueryBuilder("orders")
        .select([
            'orders.*',
            'orderDetail.weight',
        ])
        .innerJoin(OrderDetail, "orderDetail", "orderDetail.order_id = orders.id")
        .where('orders.storeId = :storeId', { storeId })
        .andWhere('orders.active = :active', { active: true })
        .orderBy('orders.createdAt', 'DESC')
        .getRawMany();
    }

    async getOrdersUnpaidByStore(storeId: number) {
        return this.orderRepository
            .createQueryBuilder("orders")
            .select([
                'orders.*',
                'orderDetail.weight',
                'payment.status'
            ])
            .innerJoin(Payment, "payment", "payment.orderId = orders.id")
            .innerJoin(OrderDetail, "orderDetail", "orderDetail.order_id = orders.id")
            .where('orders.storeId = :storeId', { storeId })
            .andWhere('orders.active = :active', { active: true })
            .andWhere('payment.status = :status', { status: 'pending' })
            .orderBy('orders.createdAt', 'DESC')
            .getRawMany();
    }

    async saveBase64Image(imageBase64: string, folder: string): Promise<string> {
        try {
            const payload = imageBase64.split(',')[1];
            const fileName = `${uuidv4()}.png`;
            const path = `files/images/${folder}/${fileName}`;

            if (!fs.existsSync(`files/images/${folder}`)) {
                fs.mkdirSync(`files/images/${folder}`, { recursive: true });
            }

            await writeFileAsync(path, payload, 'base64');

            const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
            return `${BASE_URL}/image?path=files%2Fimages%2F${folder}%2F${fileName}`;
        } catch (error) {
            console.error(error);
            throw new Error('Error saving image');
        }
    }

    async createOrder(createDto: any, file: any, storeId: number) {
        const { orderDetails, scrapImage, ...orderData } = createDto;
        
        try {
            let scrapImageUrl = '';
            if (scrapImage) {
                scrapImageUrl = await this.saveBase64Image(scrapImage, 'scrap');
            }

            let totalAmount = 0;
            for (const detail of orderDetails) {
                const material = await this.materialService.getOne(detail.materialId);
                if (!material) {
                    throw new BadRequestException(`Material with ID ${detail.materialId} not found`);
                }
                
                const detailAmount = detail.weight * material.unitPrice;
                totalAmount += detailAmount;
                detail.amount = detailAmount;
            }

            
            const order = await this.orderRepository.save({
                ...orderData,
                storeId,
                amount: totalAmount,
                scrapImageUrl,
                status: 'pending',
                createdAt: new Date(),
                modifiedAt: new Date()
            });

            for (const detail of orderDetails) {
                await this.orderDetailService.create({
                    ...detail,
                    orderId: order.id
                });
            }

            return {
                success: true,
                message: 'Order created successfully',
                data: order
            };
        } catch (error) {
            console.error(error);
            throw new BadRequestException(error.message || 'Failed to create order');
        }
    }

    async update(id: number, updateDto: any) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new BadRequestException('Order not found');
        }

        const { status, proofImage } = updateDto;

        let proofImageUrl = '';
        if (proofImage) {
            proofImageUrl = await this.saveBase64Image(proofImage, 'proof');
        }

        return this.orderRepository.update(id, {
            status,
            proofImageUrl,
            modifiedAt: new Date()
        });
    }

    async delete(id: number) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new BadRequestException('Order not found');
        }

        await this.orderDetailService.deleteByOrderId(id);

        return this.orderRepository.update(id, {
            active: false,
            deletedAt: new Date()
        });
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; 
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c;
        return distance;
    }
    
    private deg2rad(deg: number): number {
        return deg * (Math.PI/180);
    }

    async getOrderHistory(driverId: number){
        const ordersList= await this.orderRepository
        .createQueryBuilder('orders')
        .where('orders.status = :status', { status: 'completed' })
        .andWhere('orders.driver_id = :driverId', { driverId })
        .andWhere('orders.active = :active', { active: true })
        .getMany();

        const orderNearby= []

        for(const order of ordersList){
            const store = await this.getStoreInfo(order.storeId);
            const orderDetails= await this.orderDetailService.findByOrderId(order.id)
            orderNearby.push({
                ...order,
                store,
                orderDetails
            })
        }

        return orderNearby
    }

    async getNearbyOrders(driverStatus: string, driverId: number, latitude: number, longitude: number, radius: number): Promise<any[]> {
        try {
            console.log("Driver status:", driverStatus);
            
            let orderList: any[];
            
            // Nếu tài xế đang rảnh (idle), lấy các đơn hàng đang chờ và kiểm tra khoảng cách
            if (driverStatus === "idle") {
                orderList = await this.orderRepository
                    .createQueryBuilder('orders')
                    .where('orders.status = :status', { status: 'pending' })
                    .andWhere('orders.active = :active', { active: true })
                    .andWhere('(orders.declined_driver_id IS NULL OR NOT(:driverId = ANY(orders.declined_driver_id)))', { driverId })
                    .getMany();
                    
                const storeLocations = await this.storeLocationService.findAll();
                const storeLocationMap = new Map();
                storeLocations.forEach(location => {
                    storeLocationMap.set(location.storeId, {
                        latitude: location.latitude,
                        longitude: location.longitude
                    });
                });
                
                const nearbyOrders = [];
                
                for (const order of orderList) {
                    const storeLocation = storeLocationMap.get(order.storeId);
                    
                    if (storeLocation) {
                        const distance = this.calculateDistance(
                            latitude, 
                            longitude, 
                            storeLocation.latitude, 
                            storeLocation.longitude
                        );
                        
                        if (distance <= radius) {
                            // Lấy thông tin cửa hàng
                            const store = await this.getStoreInfo(order.storeId);
                            
                            // Lấy chi tiết đơn hàng
                            const orderDetails = await this.orderDetailService.findByOrderId(order.id);
                            
                            nearbyOrders.push({
                                ...order,
                                store,
                                distance: parseFloat(distance.toFixed(2)), // Làm tròn đến 2 chữ số thập phân
                                orderDetails
                            });
                        }
                    } else {
                        console.log(`No location found for store ${order.storeId}`);
                    }
                }
                
                // Sắp xếp theo khoảng cách, gần nhất lên đầu
                return nearbyOrders.sort((a, b) => a.distance - b.distance);
            } 
            // Nếu tài xế đang bận (không idle), lấy các đơn hàng đã được chấp nhận hoặc đang di chuyển
            else {
                orderList = await this.orderRepository
                    .createQueryBuilder('orders')
                    .where(new Brackets(qb => {
                        qb.where('orders.status = :accepted', { accepted: 'accepted' })
                          .orWhere('orders.status = :onMoving', { onMoving: 'on moving' });
                    }))
                    .andWhere('orders.active = :active', { active: true })
                    .andWhere('orders.driver_id = :driverId', { driverId })
                    .getMany();
                
                // Không cần kiểm tra khoảng cách, chỉ lấy thông tin cửa hàng và chi tiết đơn hàng
                const ordersWithDetails = await Promise.all(
                    orderList.map(async (order) => {
                        const store = await this.getStoreInfo(order.storeId);
                        console.log(store);
                        
                        const orderDetails = await this.orderDetailService.findByOrderId(order.id);
                        
                        return {
                            ...order,
                            store,
                            orderDetails
                        };
                    })
                );
                
                return ordersWithDetails;
            }
        } catch (error) {
            console.error('Error getting orders:', error);
            throw new BadRequestException('Failed to get orders: ' + error.message);
        }
    }

    // Hàm lấy thông tin cửa hàng
    async getStoreInfo(storeId: number) {
        console.log("1: ", storeId);
        
        try {
            const store = await this.storeService.getStoreById(storeId);
            console.log("2: ", store);
            return store;
        } catch (error) {
            console.error(`Error getting store info for store ${storeId}:`, error);
            return { 
                id: storeId,
                name: 'Unknown Store',
                phone: 'Unknown',
                address: 'Unknown Location'
            };
        }
    }

    async acceptOrder(orderId: number, driverId: number) {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        
        if (!order) {
            throw new BadRequestException('Order not found');
        }
        
        if (order.status !== 'pending') {
            throw new BadRequestException('Order is not in pending status');
        }
        
        // Cập nhật trạng thái đơn hàng và gán cho tài xế
        await this.orderRepository.update(orderId, {
            status: 'accepted',
            driverId,
            modifiedAt: new Date()
        });
        
        return { success: true, message: 'Order accepted successfully' };
    }

    async declineOrder(orderId: number, driverId: number) {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        
        if (!order) {
            throw new BadRequestException('Order not found');
        }
        
        if (order.status !== 'pending') {
            throw new BadRequestException('Order is not in pending status');
        }
        
        // Cập nhật mảng declinedDriverId để thêm tài xế đã từ chối đơn này
        const declinedDriverIds = order.declinedDriverId || [];
        
        // Kiểm tra xem tài xế đã từ chối trước đó chưa
        if (!declinedDriverIds.includes(driverId)) {
            declinedDriverIds.push(driverId);
        }
        
        await this.orderRepository.update(orderId, {
            declinedDriverId: declinedDriverIds,
            modifiedAt: new Date()
        });
        
        return { success: true, message: 'Order declined successfully' };
    }

    async cancelOrder(orderId: number, driverId: number) {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        console.log(order.driverId);
        console.log(driverId);
        
        if (!order) {
            throw new BadRequestException('Order not found');
        }
        
        if (Number(order.driverId) !== Number(driverId)) {
            throw new BadRequestException('This order is not assigned to you');
        }
        
        if (order.status === 'completed' || order.status === 'canceled') {
            throw new BadRequestException('Cannot cancel a completed or already canceled order');
        }
        
        // Cập nhật mảng canceledDriverId để thêm tài xế đã hủy đơn này
        const canceledDriverIds = order.canceledDriverId || [];
        
        // Kiểm tra xem tài xế đã hủy trước đó chưa
        if (!canceledDriverIds.includes(driverId)) {
            canceledDriverIds.push(driverId);
        }
        
        // Cập nhật trạng thái tài xế thành idle
        await this.driverService.update(driverId, { status: 'idle' });
        
        // Cập nhật đơn hàng
        await this.orderRepository.update(orderId, {
            status: 'canceled',
            driverId: null,
            canceledDriverId: canceledDriverIds,
            modifiedAt: new Date()
        });
        
        return { success: true, message: 'Order canceled successfully' };
    }

    async getByDriverId(driverId: number) {
        return this.orderRepository.find({ where: { driverId } });
    }
}
