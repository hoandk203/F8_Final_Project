import {
    Body,
    Get,
    Param,
    Post,
    Controller,
    Put,
    Delete,
    UseInterceptors,
    UploadedFile,
    Req,
    UseGuards,
    Query,
    BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { StoreService } from '../store/store.service';
import { CreateDto, UpdateDto } from './order.dto';

@Controller('order')
export class OrderController {
    constructor(
        private orderService: OrderService, 
        private storeService: StoreService,
    ) {}

    @Get('vendor/:vendorId')
    @UseGuards(JwtAuthGuard)
    async getVendorOrders(@Param('vendorId') vendorId: number) {
        return this.orderService.findAllByVendorId(vendorId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/byStore')
    async getAll(@Req() req) {
        const userId = req.user.id;
        const store = await this.storeService.getStoreIdByUserId(userId);
        console.log(store);
        return this.orderService.getOrdersByStoreId(store.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('unpaid/byStore/:storeId')
    async getOrdersUnpaidByStore(@Param ('storeId') storeId: number) {
        return this.orderService.getOrdersUnpaidByStore(storeId);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/admin")
    async adminGetAll(){
        return this.orderService.adminGetAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    getOne(@Param('id') id: number) {
        return this.orderService.getOrderById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/')
    @UseInterceptors(FileInterceptor('scrapImage'))
    async create(@Body() createDto: CreateDto, @UploadedFile() file, @Req() req) {
        const userId = req.user.id;
        const store = await this.storeService.getStoreIdByUserId(userId);
        return this.orderService.createOrder(createDto, file, store.id);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    update(@Param('id') id: number, @Body() updateDto: UpdateDto) {
        return this.orderService.update(id, updateDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    delete(@Param('id') id: number) {
        return this.orderService.delete(id);
    }

    @Get('/history/:driverId')
    async getOrderHistory(@Param('driverId') driverId: number) {
        return this.orderService.getOrderHistory(driverId);
    }

    @Get('/nearby/:driverId')
    async getNearbyOrders(
        @Param('driverId') driverId: number,
        @Query('latitude') latitude: number,
        @Query('longitude') longitude: number,
        @Query('radius') radius: number = 5, // Mặc định 5km
        @Query('driverStatus') driverStatus: string
    ) {
        console.log(`Controller: Getting nearby orders for driver ${driverId} at (${latitude}, ${longitude}) with radius ${radius}km`);
        
        // Kiểm tra tham số đầu vào
        if (!driverId || !latitude || !longitude) {
            throw new BadRequestException('Missing required parameters: driverId, latitude, longitude');
        }
        
        // Chuyển đổi kiểu dữ liệu
        const driverIdNum = Number(driverId);
        const latitudeNum = Number(latitude);
        const longitudeNum = Number(longitude);
        const radiusNum = Number(radius);
        
        if (isNaN(driverIdNum) || isNaN(latitudeNum) || isNaN(longitudeNum) || isNaN(radiusNum)) {
            throw new BadRequestException('Invalid parameter types. All parameters must be numbers.');
        }
        
        return this.orderService.getNearbyOrders(driverStatus, driverIdNum, latitudeNum, longitudeNum, radiusNum);
    }

    @Put('/:id/accept/:driverId')
    async acceptOrder(
        @Param('id') orderId: number,
        @Param('driverId') driverId: number,
    ) {
        return this.orderService.acceptOrder(orderId, driverId);
    }

    @Put('/:id/decline/:driverId')
    async declineOrder(
        @Param('id') orderId: number,
        @Param('driverId') driverId: number,
    ) {
        return this.orderService.declineOrder(orderId, driverId);
    }

    @Put('/:id/cancel/:driverId')
    async cancelOrder(
        @Param('id') orderId: number,
        @Param('driverId') driverId: number,
    ) {
        return this.orderService.cancelOrder(orderId, driverId);
    }

    @Get('/driver/:driverId')
    async getOrderByDriverId(@Param('driverId') driverId: number) {
        return this.orderService.getByDriverId(driverId);
    }
}
