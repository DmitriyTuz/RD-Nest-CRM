import { Injectable } from '@nestjs/common';
// import { RedisService as NestRedisService } from 'nestjs-redis';
// import { RedisService as NestRedisService } from '@liaoliaots/nestjs-redis';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class RedisDbService {
    private client;

    constructor(
        @InjectRedis() private readonly redis: Redis // or // @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis
    ) {}

    async set() {
        return await this.redis.set('key', 'value', 'EX', 10);
    }

    // constructor(private readonly nestRedisService: NestRedisService) {
    //     this.client = this.nestRedisService.getClient('redisConnection');
    // }
    //
    generateRecords(): void {
        // Генерация 10 произвольных записей
        for (let i = 1; i <= 10; i++) {
            this.redis.set(`key${i}`, `value${i}`);
        }
    }

    async getRandomRecords(): Promise<Record<string, string>[]> {
        // Получение 5 случайных записей
        const randomKeys = this.generateRandomKeys(5);
        const records = await this.redis.mget(randomKeys);
        return records.map((value, index) => ({ [randomKeys[index]]: value }));
    }

    private generateRandomKeys(count: number): string[] {
        const allKeys = ['key1', 'key2', 'key3', 'key4', 'key5', 'key6', 'key7', 'key8', 'key9', 'key10'];
        const randomKeys = [];

        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * allKeys.length);
            randomKeys.push(allKeys[randomIndex]);
            allKeys.splice(randomIndex, 1);
        }

        return randomKeys;
    }


}
