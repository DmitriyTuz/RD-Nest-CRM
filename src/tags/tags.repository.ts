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

    async createUserTag(dto: CreateTagDto, currentUserId) {
        const { name, color } = dto;
        const tag = await this.tagModel.findOne({where: { name, color }})

        if (tag) {
            throw new HttpException("Tag with the same name and color already exists", HttpStatus.NOT_FOUND);
        }

        return await this.tagModel.create({...dto, ownerId: currentUserId});
    }

    async bulkCreateTags(arrayForBulkCreate: any) {
        await this.tagModel.bulkCreate(arrayForBulkCreate)
    }

    async updateUserTag(dto, currentUserId) {
        const { name, color, changeName, changeColor } = dto;

        const tag = await this.tagModel.findOne({ where: { name, color, ownerId: currentUserId } });

        if (!tag) {
            throw new HttpException("Tag not found or not created by this user", HttpStatus.NOT_FOUND);
        }

        tag.name = changeName;
        tag.color = changeColor;

        await tag.save();
    }

    async deleteUserTag(deleteTagDto: TagDto, currentUserId) {
        const { name, color } = deleteTagDto;

        const tag = await this.tagModel.findOne({ where: { name, color, ownerId: currentUserId } });

        if (!tag) {
            throw new HttpException("Tag not found or not created by this user", HttpStatus.NOT_FOUND);
        }

        // if (tag.ownerId !== currentUserId) {
        //     throw new HttpException("The current user is not the creator of this tag", HttpStatus.BAD_REQUEST);
        // }
        await tag.destroy();
    }

}