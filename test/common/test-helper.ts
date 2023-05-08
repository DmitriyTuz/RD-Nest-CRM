import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppModule } from '../../src/app.module';
import {ConfigModule} from "@nestjs/config";
import {User} from "../../src/users/users.model";
import {Tag} from "../../src/tags/tags.model";
import {UserTags} from "../../src/tags/user-tags.model";

export class TestHelper {

    constructor(private app: INestApplication) {}

    public async startApp() {
        const moduleRef = await Test.createTestingModule({
            imports: [
                AppModule,
                ConfigModule.forRoot({
                    envFilePath: `.${process.env.NODE_ENV}.env`
                }),
                SequelizeModule.forRoot({
                    dialect: 'postgres',
                    host: process.env.POSTGRES_HOST,
                    port: +process.env.POSTGRES_PORT,
                    username: process.env.POSTGRES_USER,
                    password: process.env.POSTGRES_PASSWORD,
                    database: process.env.POSTGRES_DB,
                    models: [User, Tag, UserTags],
                    autoLoadModels: true
                }),
            ],
        }).compile();

        this.app = moduleRef.createNestApplication();
        await this.app.init();
    }

    public async stopApp() {
        await this.app.close();
    }

    public getApp(): INestApplication {
        return this.app;
    }
}