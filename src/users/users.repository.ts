import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import {CreateUserDto} from "./dto/create-user.dto";
import {AddTagDto} from "./dto/add-tag.dto";
import sequelize, {Transaction} from "sequelize";
import {Sequelize} from "sequelize-typescript";
import sequelizeConfig from "../../config/sequelize.config";


@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userModel.findAll();
    }

    async GetAllUsersWithTransaction(transaction?: Transaction) {
        const options = transaction ? { transaction } : {};
        return this.userModel.findAll(options);
    }

    async getUserById(id) {
        return await this.userModel.findOne({where: { id }});
    }

    async findByPk(id) {
        const user = await this.userModel.findByPk(id);
        return user;
    }

    async createUser(dto: CreateUserDto) {
        const user = await this.userModel.create(dto);
        return user;
    }

    async createUserTest(dto: CreateUserDto) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction()
        const user = await this.userModel.create(dto, {transaction});
        await transaction.rollback();
        return user;
    }

    async createUserWithTransaction(dto: CreateUserDto, transaction?: Transaction) {
        console.log('!!! transaction3.id = ', transaction['id'])
        const options = transaction ? { transaction } : {};
        const user = await this.userModel.create(dto, options);
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.userModel.findOne({
            where: { email },
            include: { all: true },
        });
        return user;
    }

    async deleteUserById(id) {
        const user = await this.userModel.destroy({where: {id} });
        return user;
    }

    async deleteUserByEmail(email: string) {
        const user = await this.userModel.destroy({where: {email} });
        return user;
    }

    // async addTag(dto: AddTagDto, req) {
    //
    //     try {
    //         const user = await this.userModel.findByPk(req.user.id);
    //         const tag = await this.tagService.getTagByNameAndColor(dto.name, dto.color);
    //         // const alreadyExists = await this.user_tagRepository.findOne({where: {userId: user.id, tagId: tag.id}})
    //         //
    //         // if (alreadyExists) {
    //         //     throw new HttpException("Already exists", HttpStatus.BAD_REQUEST)
    //         // }
    //
    //         if (tag && user) {
    //             await user.$add("tag", tag.id);
    //             return dto;
    //         }
    //         throw new HttpException("User or tag not found", HttpStatus.NOT_FOUND);
    //     } catch (e) {
    //         throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
    //     }
    // }
}