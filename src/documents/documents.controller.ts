import {Controller, Post} from '@nestjs/common';
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";

@Controller('documents')
export class DocumentsController {
    constructor(@InjectQueue('document') private readonly documentQueue: Queue) {}

    @Post('transcode')
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
