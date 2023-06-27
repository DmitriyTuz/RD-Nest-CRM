import { Injectable } from '@nestjs/common';
import { AwsConfigService } from '../aws.config/aws.config.service';
import { File } from 'multer';
import {DeleteObjectRequest} from "aws-sdk/clients/s3";

@Injectable()
export class S3Service {
    constructor(private awsConfigService: AwsConfigService) {}

    async uploadFileToS3(file: File, bucketName: string, key: string): Promise<string> {
        const s3 = this.awsConfigService.getS3Instance();
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        await s3.upload(params).promise();

        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
        return fileUrl;
    }

    async deleteFileFromS3(bucketName: string, key: string): Promise<void> {
        const s3 = this.awsConfigService.getS3Instance();
        const params: DeleteObjectRequest = {
            Bucket: bucketName,
            Key: key,
        };
        await s3.deleteObject(params).promise();
    }

}
