import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {CreatePostDto} from "../posts/dto/create-post.dto";
import {CreateOrderDto} from "./dto/create-post.dto";
import {PostsService} from "../posts/posts.service";
import {OrdersService} from "./orders.service";

@Controller('orders')
export class OrdersController {

    constructor(private orderService: OrdersService) {}

    @Post('create')

    createPost(@Body() dto: CreateOrderDto) {
        return this.orderService.create(dto);
    }
}
