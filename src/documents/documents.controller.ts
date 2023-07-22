import {Controller, Post} from '@nestjs/common';
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags("Redis queue")
@Controller('Redis queue')
export class DocumentsController {
    constructor(@InjectQueue('document') private readonly documentQueue: Queue) {}

    @Post('transcode')
    @ApiOperation({ summary: "Create redis queue" })
    @ApiResponse({ status: 200, description: 'successful'})
    async transcode() {
        let data = await this.documentQueue.add('transcode', {
            file: 'document.txt'
        }, {
            delay: 5000,
        })
        return {
            message: 'start',
            data: data.data
        }
    }
}
