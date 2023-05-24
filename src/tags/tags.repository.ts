import {InjectModel} from "@nestjs/sequelize";
import {Tag} from "./tags.model";
import {User} from "../users/users.model";
import {CreateTagDto} from "./dto/create-tag.dto";
import {Op, Transaction} from "sequelize";


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

    async findTagsByArrayOfNameAndColorWithTransaction(tags, transaction?: Transaction) {
        // const options = transaction ? { transaction } : {};
        return this.tagModel.findAll({where: {[Op.or]: tags}, transaction});
    }

    async getTagByNameAndColor(name: string, color: string) {
        const user = await this.tagModel.findOne({where: { name, color }});
        return user;
    }

    async getTagById(id: number) {
        const user = await this.tagModel.findOne({where: { id }});
        return user;
    }

    async create(dto: CreateTagDto, ownerId) {
        const tag = await this.tagModel.create({...dto, ownerId: ownerId});
        return tag;
    }

    async bulkCreateTags(arrayForBulkCreate: any) {
        await this.tagModel.bulkCreate(arrayForBulkCreate)
    }

    async bulkCreateTagsWithTransaction(arrayForBulkCreate: any, transaction?: Transaction): Promise<Tag[]> {
        const options = transaction ? { transaction } : {};
        return this.tagModel.bulkCreate(arrayForBulkCreate, options)
    }

    // async findOrCreateTags(tags, currentUserId) {
    //     // const p = [];
    //     // const s = [];
    //
    //     await this.tagModel.find
    //
    //     for (const t of tags) {
    //         s.push(getOneTag({name: t[0].toLowerCase(), color: t[1]}, currentUserId));
    //     }
    //
    //     return s
    //
    //     // return await this.tagModel.findOrCreate({
    //     //     where: {
    //     //         name: tags[0][0],
    //     //         color: tags[0][1]
    //     //     }
    //     // })
    // }

}