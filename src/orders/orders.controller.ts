import {Body, Controller, Post} from '@nestjs/common';
import {CreateOrderDto} from "./dto/create-order.dto";
import {OrdersService} from "./orders.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Order} from "./orders.model";

@ApiTags("Orders")
@Controller('orders')
export class OrdersController {

    constructor(private orderService: OrdersService) {}

    @Post('create')
    @ApiOperation({ summary: "Order creation" })
    @ApiResponse({ status: 200, type: Order })
    createPost(@Body() dto: CreateOrderDto) {
        return this.orderService.create(dto);
    }
}
