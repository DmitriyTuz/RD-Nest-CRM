import { Sequelize } from 'sequelize-typescript';
import { User } from '../../src/users/users.model';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import {Tag} from "../../src/tags/tags.model";
import {UserTags} from "../../src/tags/user-tags.model";
import {UsersModule} from "../../dist/users/users.module";
import {INestApplication} from "@nestjs/common";

export class SequelizeTestHelper {
    private readonly sequelize: Sequelize;
    app: INestApplication;

    constructor(private readonly appModule: typeof AppModule,
                private readonly userModule: typeof UsersModule) {
        this.sequelize = new Sequelize({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Tag, UserTags],
        });
    }

    async init() {
        const module = await Test.createTestingModule({
            imports: [this.appModule, this.userModule],
        }).compile();

        this.app = module.createNestApplication();
        await this.app.init();
    }

    async close() {
        await this.app.close();
    }

}