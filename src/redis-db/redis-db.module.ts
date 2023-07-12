import { Module } from '@nestjs/common';
import { RedisDbController } from './redis-db.controller';
import { RedisDbService } from './redis-db.service';

@Module({
  controllers: [RedisDbController],
  providers: [RedisDbService],

  exports: [RedisDbService],
})
export class RedisDbModule {}
