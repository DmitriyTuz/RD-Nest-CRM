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
                // private readonly userModule: typeof UsersModule,
                // private readonly authModule: typeof AuthModule
                ) {}

    async init() {
        const module = await Test.createTestingModule({
            // imports: [AppModule]
            imports: [this.appModule]
        }).compile();

        // console.log('!!! secret key in helper = ', process.env.PRIVATE_KEY)
        this.app = await module.createNestApplication();
        await this.app.init();
    }

    async clearDatabase() {
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