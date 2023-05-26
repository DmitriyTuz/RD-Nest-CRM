import { Sequelize } from 'sequelize-typescript';
import { User } from '../../src/users/users.model';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import {UsersModule} from "../../src/users/users.module";
import {INestApplication} from "@nestjs/common";
import {AuthModule} from "../../src/auth/auth.module";
import {AuthService} from "../../src/auth/auth.service";
import {Tag} from "../../src/tags/tags.model";
import {UserTags} from "../../src/tags/user-tags.model";
import sequelizeConfig from "../../config/sequelize.config";
import {TransactionWrapperService} from "../../src/helpers/transaction-wrapper.service";

export class TestHelper {

    app: INestApplication;
    public sequelize: Sequelize;

    constructor(private readonly appModule: typeof AppModule,
                private readonly userModule: typeof UsersModule,
                private readonly authModule: typeof AuthModule
                ) {

        // this.sequelize = new Sequelize({
        //     dialect: 'postgres',
        //     host: process.env.POSTGRES_HOST,
        //     port: +process.env.POSTGRES_PORT,
        //     username: process.env.POSTGRES_USER,
        //     password: process.env.POSTGRES_PASSWORD,
        //     database: process.env.POSTGRES_DB,
        //     models: [User, Tag, UserTags]
        // });
    }

    async init() {
        const module = await Test.createTestingModule({
            providers: [
                // TransactionWrapperService,
                // {
                //     provide: AuthService,
                //     useValue: {
                //         getCurrentUser: jest.fn(),
                //     },
                // },

                // {
                //     provide: Sequelize,
                //     useValue: new Sequelize(sequelizeConfig),
                // },
            ],
            imports: [this.appModule, this.userModule, this.authModule]

        }).compile();

        // console.log('!!! secret key in helper = ', process.env.PRIVATE_KEY)
        this.app = module.createNestApplication();
        await this.app.init();
    }

    async clearDatabase(): Promise<void> {
        // await UserTags.destroy({where: {}});
        await User.destroy({where: {}});
        await Tag.destroy({where: {}});
        await UserTags.destroy({where: {}});

        // await User.truncate({ cascade: true });
    }

    async close() {
        await this.app.close();
    }

}