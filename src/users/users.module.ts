import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Tag} from "../tags/tags.model";
import {UserTags} from "../tags/user-tags.model";
import {AuthModule} from "../auth/auth.module";
import {TagsModule} from "../tags/tags.module";
import {UserRepository} from "./users.repository";
import {TagsService} from "../tags/tags.service";
import {TagRepository} from "../tags/tags.repository";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, TagsService, TagRepository],
  imports: [
      SequelizeModule.forFeature([User, Tag, UserTags]),
      TagsModule,
      forwardRef(() => AuthModule)
  ],
    exports: [UsersService, SequelizeModule]
})
export class UsersModule {}
