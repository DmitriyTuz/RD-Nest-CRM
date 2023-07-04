import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {PostsController} from "../posts/posts.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {OrdersController} from "./orders.controller";
import {Order} from "./orders.model";
import {OrderTags} from "../tags/order-tags.model";

@Module({
  providers: [OrdersService],
  controllers: [OrdersController],
  imports: [SequelizeModule.forFeature([User, Order, OrderTags])],
  exports: [OrdersService]
})
export class OrdersModule {}
