import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Order} from "./orders.model";
import {CreateOrderDto} from "./dto/create-order.dto";

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order) private orderRepository: typeof Order) {}

    async create(dto: CreateOrderDto) {
        return await this.orderRepository.create(dto);
    }
}
