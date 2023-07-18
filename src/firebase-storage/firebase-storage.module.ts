import { Module } from '@nestjs/common';
import {FirebaseStorageController} from "./firebase-storage.controller";
import {FirebaseStorageService} from "./firebase-storage.service";
import {FirebaseConfigModule} from "../firebase.config/firebase.config.module";

@Module({
    imports: [FirebaseConfigModule],
    controllers: [FirebaseStorageController],
    providers: [FirebaseStorageService],
    exports: [FirebaseStorageService]
})
export class FirebaseStorageModule {}
