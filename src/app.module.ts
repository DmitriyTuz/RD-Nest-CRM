import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import { UsersModule } from './users/users.module';
import {User} from "./users/users.model";
import { TagsModule } from './tags/tags.module';
import {Tag} from "./tags/tags.model";
import {UserTags} from "./tags/user-tags.model";
import {AuthModule} from "./auth/auth.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Tag, UserTags],
            autoLoadModels: true,
            // logging: false
        }),
        // SequelizeModule.forFeature([User, Tag, UserTags]),
        UsersModule,
        TagsModule,
        AuthModule,
        JwtModule
    ],

})
export class AppModule {}