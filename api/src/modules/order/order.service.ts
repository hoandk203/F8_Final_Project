import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { createQueryBuilder, Repository } from 'typeorm';
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

const writeFileAsync = promisify(fs.writeFile);

@Injectable()
export class OrderService extends BaseService {
    constructor(
        @Inject('ORDER_REPOSITORY')
        private orderRepository: Repository<Order>,
        private storeLocationService: StoreLocationService,
        private orderDetailService: OrderDetailService,
        private materialService: MaterialService,
        private storeService: StoreService
    ) {
        super(orderRepository);
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

    async saveBase64Image(imageBase64: string): Promise<string> {
        try {
            const payload = imageBase64.split(',')[1];
            const fileName = `${uuidv4()}.png`;
            const path = `files/images/scrap/${fileName}`;

            // Đảm bảo thư mục tồn tại
            if (!fs.existsSync('files/images/scrap')) {
                fs.mkdirSync('files/images/scrap', { recursive: true });
            }

            await writeFileAsync(path, payload, 'base64');
            
            const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
            return `${BASE_URL}/image?path=files%2Fimages%2Fscrap%2F${fileName}`;
        } catch (error) {
            console.error(error);
            throw new Error('Error saving image');
        }
    }

    async createOrder(createDto: any, file: any, storeId: number) {
        const { orderDetails, scrapImage, ...orderData } = createDto;
        
        try {
            // Lưu ảnh và lấy URL
            let scrapImageUrl = '';
            if (scrapImage) {
                scrapImageUrl = await this.saveBase64Image(scrapImage);
            }

            // Tính tổng amount từ orderDetails
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

            // Tạo order
            const order = await this.orderRepository.save({
                ...orderData,
                storeId,
                amount: totalAmount,
                scrapImageUrl,
                status: 'pending',
                createdAt: new Date(),
                modifiedAt: new Date()
            });

            // Tạo order details
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

        // Chỉ cho phép cập nhật một số trường nhất định
        const { status } = updateDto;
        
        return this.orderRepository.update(id, {
            status,
            modifiedAt: new Date()
        });
    }

    async delete(id: number) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new BadRequestException('Order not found');
        }

        // Xóa order details trước
        await this.orderDetailService.deleteByOrderId(id);

        // Cập nhật active thành false thay vì xóa
        return this.orderRepository.update(id, {
            active: false,
            deletedAt: new Date()
        });
    }

    // Hàm tính khoảng cách giữa hai điểm dựa trên tọa độ (theo công thức Haversine)
    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Bán kính trái đất tính bằng km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c; // Khoảng cách tính bằng km
        return distance;
    }
    
    private deg2rad(deg: number): number {
        return deg * (Math.PI/180);
    }

    async getNearbyOrders(driverId: number, latitude: number, longitude: number, radius: number): Promise<any[]> {
        try {
            console.log(`Service: Getting nearby orders for driver ${driverId} at (${latitude}, ${longitude}) with radius ${radius}km`);
            
            // Lấy tất cả các đơn hàng đang ở trạng thái pending
            const pendingOrders = await this.orderRepository
                .createQueryBuilder('orders')
                .where('orders.status = :status', { status: 'pending' })
                .andWhere('orders.active = :active', { active: true })
                .andWhere('(orders.declinedDriverId IS NULL OR orders.declinedDriverId != :driverId)', { driverId })
                .getMany();
            

            // Lấy tất cả vị trí của các cửa hàng
            const storeLocations = await this.storeLocationService.findAll();

            // Tạo map để tra cứu nhanh vị trí của cửa hàng
            const storeLocationMap = new Map();
            storeLocations.forEach(location => {
                storeLocationMap.set(location.storeId, {
                    latitude: location.latitude,
                    longitude: location.longitude
                });
            });
            

            // Lọc các đơn hàng trong bán kính cho trước
            const nearbyOrders = [];
            
            for (const order of pendingOrders) {
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
                    } else {
                    }
                } else {
                    console.log(`No location found for store ${order.storeId}`);
                }
            }
            

            // Sắp xếp theo khoảng cách, gần nhất lên đầu
            return nearbyOrders.sort((a, b) => a.distance - b.distance);
            
        } catch (error) {
            console.error('Error getting nearby orders:', error);
            throw new BadRequestException('Failed to get nearby orders: ' + error.message);
        }
    }

    // Hàm lấy thông tin cửa hàng
    async getStoreInfo(storeId: number) {
        try {
            const store = await this.storeService.getStoreById(storeId);
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
        
        // Cập nhật trường declinedDriverId để đánh dấu tài xế đã từ chối đơn này
        await this.orderRepository.update(orderId, {
            declinedDriverId: driverId,
            modifiedAt: new Date()
        });
        
        return { success: true, message: 'Order declined successfully' };
    }
}
