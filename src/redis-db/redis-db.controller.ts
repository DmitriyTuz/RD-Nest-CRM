import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import { RedisDbService } from './redis-db.service';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('redis')
export class RedisDbController {
    constructor(private readonly redisService: RedisDbService) {}

    @Get('generate')
    @UseGuards(JwtAuthGuard)
    generateRecords(): string {
        this.redisService.generateRecords();
        return 'Records generated';
    }

    @Get('random')
    @UseGuards(JwtAuthGuard)
    async getRandomRecords(): Promise<string> {
        const records = await this.redisService.getRandomRecords();
        return JSON.stringify(records);
    }
}
