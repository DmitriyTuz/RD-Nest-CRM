import { Sequelize } from 'sequelize-typescript';
import { User } from '../../src/users/users.model';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import {UsersModule} from "../../dist/users/users.module";
import {INestApplication} from "@nestjs/common";
import {AuthModule} from "../../dist/auth/auth.module";
import {AuthService} from "../../dist/auth/auth.service";

export class TestHelper {

    app: INestApplication;

    constructor(private readonly appModule: typeof AppModule,
                private readonly userModule: typeof UsersModule,
                private readonly authModule: typeof AuthModule
                ) {
    }

    async init() {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        getCurrentUser: jest.fn(),
                    },
                },
            ],
            imports: [this.appModule, this.userModule, this.authModule]

        }).compile();

        console.log('!!! secret key in helper = ', process.env.PRIVATE_KEY)
        this.app = module.createNestApplication();
        await this.app.init();
    }

    async close() {
        await this.app.close();
    }

}