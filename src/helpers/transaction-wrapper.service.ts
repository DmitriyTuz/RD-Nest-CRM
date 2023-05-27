import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import sequelizeConfig from "../../config/sequelize.config";

@Injectable()
export class TransactionWrapperService {
    private readonly sequelize: Sequelize;
    private transaction: any;

    constructor() {
        this.sequelize = new Sequelize(sequelizeConfig)
    }

    async runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
        const transaction = await this.sequelize.transaction();
        try {
            // return await fn();

            const result = await fn();
            await transaction.rollback();
            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async rollback(): Promise<void> {
        if (this.transaction) {
            await this.transaction.rollback();
        }
    }
}