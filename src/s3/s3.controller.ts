import {Controller, Delete, Param, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { File } from 'multer';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags("AWS S3")
@Controller('s3')
export class S3Controller {
    constructor(private s3Service: S3Service) {}

    @Post('upload')
    @ApiOperation({ summary: "Upload file to AWS S3" })
    @ApiResponse({ status: 200, description: 'upload successful' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFileToS3(@UploadedFile() file: File) {
        const bucketName = process.env.AWS_BUCKET_NAME;
        const key = `${Date.now()}-${file.originalname}`;

        const fileUrl = await this.s3Service.uploadFileToS3(file, bucketName, key);

        return { fileUrl };
    }

    @Delete('remove/:key')
    @ApiOperation({ summary: "Delete file from AWS S3" })
    @ApiResponse({ status: 200, description: 'deletion successful'})
    async deleteFileFromS3(@Param('key') key: string) {
        const bucketName = process.env.AWS_BUCKET_NAME;
        await this.s3Service.deleteFileFromS3(bucketName, key);
        return { message: 'File deleted successfully' };
    }

}
