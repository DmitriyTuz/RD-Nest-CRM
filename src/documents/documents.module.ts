import { Module } from '@nestjs/common';
import {BullModule} from "@nestjs/bull";
import { DocumentsController } from './documents.controller';
import { DocumentsProcessor } from './documents.processor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'document'
        })
    ],
    controllers: [DocumentsController],
    providers: [DocumentsProcessor]
})

export class DocumentsModule {}
