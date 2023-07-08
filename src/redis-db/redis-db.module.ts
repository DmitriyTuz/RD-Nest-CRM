import { Module } from '@nestjs/common';
import { RedisDbController } from './redis-db.controller';
import { RedisDbService } from './redis-db.service';
// import {RedisModule as NestRedisModule} from "@liaoliaots/nestjs-redis";
import {RedisService} from "@liaoliaots/nestjs-redis";

@Module({
  controllers: [RedisDbController],
  providers: [RedisDbService],
  imports: [
    // NestRedisModule.register({
    //   name: 'redisConnection',
    //
    //   host: 'localhost',
    //   port: 6379
    //   // url: 'redis://localhost:6379'
    // }),

      // NestRedisModule.forRoot({
      //     config: {
      //         name: 'redisConnection',
      //         host: 'localhost',
      //         port: 6379,
      //         password: 'authpassword'
      //     }
      // }),

  ],
  exports: [RedisDbService],
})
export class RedisDbModule {}
