import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Tag} from "../tags/tags.model";
import {UserTags} from "../tags/user-tags.model";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      SequelizeModule.forFeature([User, Tag, UserTags])
  ],
    exports: [UsersService]
})
export class UsersModule {}
