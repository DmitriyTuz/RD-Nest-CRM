import { SequelizeOptions } from 'sequelize-typescript';
import {User} from "../src/users/users.model";
import {Tag} from "../src/tags/tags.model";
import {UserTags} from "../src/tags/user-tags.model";

const sequelizeConfig: SequelizeOptions = {
    database: 'RaDevs-db',
    username: 'postgres',
    password: '1111',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    models: [User, Tag, UserTags],
    logging: false,

};

export default sequelizeConfig;