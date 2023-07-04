import {Module} from '@nestjs/common';
import { TagsService } from './tags.service';
import {TagsController} from "./tags.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {Tag} from "./tags.model";
import {User} from "../users/users.model";
import {UserTags} from "./user-tags.model";
import {AuthModule} from "../auth/auth.module";
import {TagRepository} from "./tags.repository";
import {OrderTags} from "./order-tags.model";

@Module({
  controllers: [TagsController],
  providers: [TagsService, TagRepository],
  imports: [
      SequelizeModule.forFeature([Tag, User, UserTags, OrderTags]),
      AuthModule
  ],
  exports: [TagsService]
})
export class TagsModule {}
