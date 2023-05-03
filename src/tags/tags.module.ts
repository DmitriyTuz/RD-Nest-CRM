import {forwardRef, Module} from '@nestjs/common';
import { TagsService } from './tags.service';
import {TagsController} from "./tags.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {Tag} from "./tags.model";
import {User} from "../users/users.model";
import {UserTags} from "./user-tags.model";
import {AuthModule} from "../auth/auth.module";
import {AuthService} from "../auth/auth.service";

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [
      SequelizeModule.forFeature([Tag, User, UserTags]),
      AuthModule
  ],
  exports: [TagsService]
})
export class TagsModule {}
