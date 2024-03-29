import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import {UsersModule} from './users/users.module';
import {User} from "./users/users.model";
import {TagsModule} from './tags/tags.module';
import {Tag} from "./tags/tags.model";
import {UserTags} from "./tags/user-tags.model";
import {AuthModule} from "./auth/auth.module";
import {JwtModule} from "@nestjs/jwt";
import {FilesModule} from "./files/files.module";
import {PostsModule} from "./posts/posts.module";
import {Posts} from "./posts/posts.model";
import {AwsConfigModule} from './aws.config/aws.config.module';
import {S3Module} from './s3/s3.module';
import {OrdersModule} from './orders/orders.module';
import {OrderTags} from "./tags/order-tags.model";
import {Order} from "./orders/orders.model";
import {RedisModule} from '@liaoliaots/nestjs-redis';
import {RedisDbModule} from "./redis-db/redis-db.module";
import {BullModule} from "@nestjs/bull";
import { DocumentsModule } from './documents/documents.module';
import { FirebaseConfigModule } from './firebase.config/firebase.config.module';
import { FirebaseStorageModule } from './firebase-storage/firebase-storage.module';


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
            models: [User, Tag, UserTags, Posts, Order, OrderTags],
            // autoLoadModels: true,
            logging: false
        }),

        RedisModule.forRoot({
            config: {
                // name: 'redisConnection',
                host: process.env.REDIS_HOST,
                port: +process.env.REDIS_PORT,
                // password: 'authpassword'
            }
        }),

        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST,
                port: +process.env.REDIS_PORT
            }
        }),

        UsersModule,
        TagsModule,
        AuthModule,
        JwtModule,
        PostsModule,
        FilesModule,
        AwsConfigModule,
        S3Module,
        OrdersModule,
        RedisDbModule,
        DocumentsModule,
        FirebaseConfigModule,
        FirebaseStorageModule
    ],

})
export class AppModule {}