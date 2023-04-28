import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import {TagsController} from "./tags.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {Tag} from "./tags.model";
import {User} from "../users/users.model";
import {UserTags} from "./user-tags.model";

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [
    SequelizeModule.forFeature([Tag, User, UserTags])
  ]
})
export class TagsModule {}
