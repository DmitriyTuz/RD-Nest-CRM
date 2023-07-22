import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import { RedisDbService } from './redis-db.service';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Order} from "../orders/orders.model";

@ApiTags("Redis")
@Controller('redis')
export class RedisDbController {
    constructor(private readonly redisService: RedisDbService) {}

    @Get('generate')
    @ApiOperation({ summary: "Records generate" })
    @ApiResponse({ status: 200, description: 'generation successful'})
    @UseGuards(JwtAuthGuard)
    generateRecords(): string {
        this.redisService.generateRecords();
        return 'Records generated';
    }

    @Get('random')
    @ApiOperation({ summary: "Get some records" })
    @ApiResponse({ status: 200, description: 'successful'})
    @UseGuards(JwtAuthGuard)
    async getRandomRecords(): Promise<string> {
        const records = await this.redisService.getRandomRecords();
        return JSON.stringify(records);
    }
}
