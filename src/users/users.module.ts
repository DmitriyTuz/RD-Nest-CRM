import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Tag} from "../tags/tags.model";
import {UserTags} from "../tags/user-tags.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      SequelizeModule.forFeature([User, Tag, UserTags]),
      forwardRef(() => AuthModule)
  ],
    exports: [UsersService, AuthModule]
})
export class UsersModule {}
