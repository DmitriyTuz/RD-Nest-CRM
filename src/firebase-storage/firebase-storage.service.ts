import { Injectable } from '@nestjs/common';
import { FirebaseConfigService } from '../firebase.config/firebase.config.service';
import { File } from 'multer';
import * as admin from 'firebase-admin';
// import { Storage } from '@google-cloud/storage/build/src';

@Injectable()
export class FirebaseStorageService {
    private storage: admin.storage.Storage;

    constructor(private firebaseConfigService: FirebaseConfigService) {
        this.storage = firebaseConfigService.getFirebaseApp().storage();
    }

    async uploadFileToFirebaseStorage(file: File, bucketName: string, filePath: string): Promise<string> {
        const bucket = this.storage.bucket(bucketName);
        const fileRef = bucket.file(filePath);

        const fileStream = fileRef.createWriteStream({
            contentType: file.mimetype,
        });

        await new Promise<void>((resolve, reject) => {
            fileStream.on('finish', resolve);
            fileStream.on('error', reject);
            fileStream.end(file.buffer);
        });

        const [metadata] = await fileRef.getMetadata();
        const fileUrl = metadata.mediaLink;

        return fileUrl;
    }

    async deleteFileFromFirebaseStorage(bucketName: string, filePath: string): Promise<void> {
        const bucket = this.storage.bucket(bucketName);
        const fileRef = bucket.file(filePath);

        await fileRef.delete();
    }
}
