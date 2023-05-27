import { Sequelize } from 'sequelize-typescript';
import sequelizeConfig from "../../config/sequelize.config";

const sequelize = new Sequelize(sequelizeConfig)

module.exports = {
    wrapPgTransaction: async fn => {
        await sequelize.transaction({autocommit: false}, async () => {
            await fn();
        })
    }
}