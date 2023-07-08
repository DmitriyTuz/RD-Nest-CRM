import { Controller, Get } from '@nestjs/common';
import { RedisDbService } from './redis-db.service';

@Controller('redis')
export class RedisDbController {
    constructor(private readonly redisService: RedisDbService) {}

    @Get('generate')
    generateRecords(): string {
        this.redisService.generateRecords();
        return 'Records generated';
    }

    @Get('random')
    getRandomRecords(): string {
        const records = this.redisService.getRandomRecords();
        return JSON.stringify(records);
    }
}
