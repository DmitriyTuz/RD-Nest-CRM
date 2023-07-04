import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Post} from "../posts/posts.model";
import {FilesService} from "../files/files.service";
import {Order} from "./orders.model";
import {CreateOrderDto} from "./dto/create-post.dto";

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order) private orderRepository: typeof Order) {}

    async create(dto: CreateOrderDto) {
        return await this.orderRepository.create(dto);
    }
}
