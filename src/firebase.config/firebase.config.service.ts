import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseConfigService {
    private firebaseApp: admin.app.App;

    constructor(private configService: ConfigService) {
        const firebaseConfig = {
            projectId: this.configService.get('FIREBASE_PROJECT_ID'),
            clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
            privateKey: this.configService.get('FIREBASE_PRIVATE_KEY'),
        };

        this.firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
            storageBucket: `${firebaseConfig.projectId}.appspot.com`,
        });
    }

    getFirebaseApp(): admin.app.App {
        return this.firebaseApp;
    }
}


