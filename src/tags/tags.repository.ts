import {InjectModel} from "@nestjs/sequelize";
import {Tag} from "./tags.model";
import {CreateTagDto} from "./dto/create-tag.dto";
import {Op} from "sequelize";
import {TagDto} from "../users/dto/add-tag.dto";
import {HttpException, HttpStatus} from "@nestjs/common";


// const getOneTag = async (findQuery, ownerId) => {
//     let foundTag = await Tag.findOne({attributes: ['id', 'name', 'color'], where: findQuery});
//     if (foundTag) {
//         return foundTag
//     } else {
//         return await Tag.create({...findQuery, ownerId});
//     }
// }

export class TagRepository {
    constructor(
        @InjectModel(Tag)
        private readonly tagModel: typeof Tag,
    ) {}

    async findAll(): Promise<Tag[]> {
        return this.tagModel.findAll({include: {all: true}});
    }

    async findTagsByArrayOfNameAndColor(tags): Promise<Tag[]> {
        return this.tagModel.findAll({where: {[Op.or]: tags}});
    }

    async getTagByNameAndColor(name: string, color: string) {
        return await this.tagModel.findOne({where: {name, color}});
    }

    async getTagById(id: number) {
        return await this.tagModel.findOne({where: {id}});
    }

    async createUserTag(dto, currentUserId) {
        const { name, color } = dto;
        const tag = await this.tagModel.findOne({where: { name, color }})

        if (tag) {
            throw new HttpException("This tag already exists", HttpStatus.FOUND);
        }

        return await this.tagModel.create({...dto, ownerId: currentUserId});
    }

    async createTagOfOrder(dto, currentUserId) {
        const { name, color, orderId } = dto;
        const tag = await this.tagModel.findOne({where: { name, color, orderId }})

        if (tag) {
            throw new HttpException("This tag already exists", HttpStatus.FOUND);
        }

        return await this.tagModel.create({...dto, ownerId: currentUserId});
    }

    async bulkCreateTags(arrayForBulkCreate: any) {
        await this.tagModel.bulkCreate(arrayForBulkCreate)
    }

    async updateUserTag(tagId, dto, currentUserId) {
        const { changeName, changeColor } = dto;

        const tag = await this.tagModel.findOne({ where: { id: tagId, ownerId: currentUserId } });

        if (!tag) {
            throw new HttpException("Tag not found or not created by this user", HttpStatus.NOT_FOUND);
        }

        tag.name = changeName;
        tag.color = changeColor;

        await tag.save();
    }

    async deleteUserTag(tagId, currentUserId) {

        const tag = await this.tagModel.findOne({ where: { id: tagId, ownerId: currentUserId } });

        if (!tag) {
            throw new HttpException("Tag not found or not created by this user", HttpStatus.NOT_FOUND);
        }

        // if (tag.ownerId !== currentUserId) {
        //     throw new HttpException("The current user is not the creator of this tag", HttpStatus.BAD_REQUEST);
        // }
        await tag.destroy();
    }

    async deleteTagOfOrder(tagId, orderId, currentUserId) {
        const tag = await this.tagModel.findOne({ where: { id: tagId, orderId: orderId, ownerId: currentUserId } });

        if (!tag) {
            throw new HttpException("Tag not found or not created by this user", HttpStatus.NOT_FOUND);
        }

        await tag.destroy();
    }
}