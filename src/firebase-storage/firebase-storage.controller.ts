import { Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseStorageService } from './firebase-storage.service';
import { File } from 'multer';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags("Firebase Storage")
@Controller('firebase-storage')
export class FirebaseStorageController {
    constructor(private firebaseStorageService: FirebaseStorageService) {}

    @Post('upload')
    @ApiOperation({ summary: "Upload file to Firebase Storage" })
    @ApiResponse({ status: 200, description: 'upload successful' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFileToFirebaseStorage(@UploadedFile() file: File) {
        const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
        const filePath = `${Date.now()}-${file.originalname}`;

        const fileUrl = await this.firebaseStorageService.uploadFileToFirebaseStorage(file, bucketName, filePath);

        return { fileUrl };
    }

    @Delete('remove/:filePath')
    @ApiOperation({ summary: "Delete file from Firebase Storage" })
    @ApiResponse({ status: 200, description: 'deletion successful'})
    async deleteFileFromFirebaseStorage(@Param('filePath') filePath: string) {
        const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
        await this.firebaseStorageService.deleteFileFromFirebaseStorage(bucketName, filePath);
        return { message: 'File deleted successfully' };
    }
}

