import {
    Body,
    Get,
    Param,
    Post,
    Controller,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { CreateDto } from './order-detail.dto';
import { OrderDetailService } from './order-detail.service';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';

@Controller('order-detail')
export class OrderDetailController {
    constructor(private orderDetailService: OrderDetailService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    getAll() {
        return this.orderDetailService.getList();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/order/:orderId')
    getByOrderId(@Param('orderId') orderId: number) {
        return this.orderDetailService.getByOrderId(orderId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/')
    create(@Body() createDto: CreateDto) {
        return this.orderDetailService.create(createDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    delete(@Param('id') id: number) {
        return this.orderDetailService.softDelete(id);
    }
}
