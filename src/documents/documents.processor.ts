import {Logger} from '@nestjs/common';
import {OnQueueActive, OnQueueCompleted, Process, Processor} from "@nestjs/bull";
import {Job} from "bull";

@Processor('document')
export class DocumentsProcessor {
    private readonly logger = new Logger(DocumentsProcessor.name)

    @Process({name: 'transcode', concurrency: 2})
    async handleTranscode (job: Job) {
        //     console.log(Job.data)
        // }
        let progress = 0;
        for (let i = 0; i < 100; i++) {
            progress += 1;
            await job.progress(progress);
        }
        return {progress}
    }

    @OnQueueActive()
    onActive(job: Job) {
        console.log('job.id = ', job.id)
    }

    @OnQueueCompleted()
    onCompleted(job: Job, result: any) {
        console.log('job.id = ', job.id, 'result = ', result)
    }
}
