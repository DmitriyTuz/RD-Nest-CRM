import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Tag} from "./tags.model";
import {CreateTagDto} from "./dto/create-tag.dto";
import {UserRepository} from "../users/users.repository";
import {TagRepository} from "./tags.repository";
import {Transaction} from "sequelize";

@Injectable()
export class TagsService {

    // constructor(
    //     @InjectModel(Tag) private tagRepository: typeof Tag
    // ) {}

    constructor(private readonly tagRepository: TagRepository) {}

    // async createTag(dto: CreateTagDto, userId) {
    //     const tag = await this.tagRepository.create({...dto, ownerId: userId});
    //     return tag;
    // }

    async getAllTags() {
        const tags = await this.tagRepository.findAll();
        return tags;
    }

    async getTagById(id: number) {
        const user = await this.tagRepository.getTagById(id);
        return user;
    }
    //
    async getTagByNameAndColor(name: string, color: string) {
        const user = await this.tagRepository.getTagByNameAndColor(name, color);
        return user;
    }

    async bulkCreateTags(arrayForBulkCreate: any) {
        await this.tagRepository.bulkCreateTags(arrayForBulkCreate)
    }

    async bulkCreateTagsWithTransaction(arrayForBulkCreate: any, transaction?: Transaction) {
        return await this.tagRepository.bulkCreateTagsWithTransaction(arrayForBulkCreate, transaction)
    }

    async createTag(dto: CreateTagDto, ownerId) {
        const tag = await this.tagRepository.create(dto, ownerId);
        return tag;
    }

    // async findOrCreateTags(tags: Array<any>, currentUserId: number) {
    //     return findOrCreateTags(tags, currentUserId)
    // }

    async findTagsByArrayOfNameAndColor(tags) {
        return await this.tagRepository.findTagsByArrayOfNameAndColor(tags)
    }

    async findTagsByArrayOfNameAndColorWithTransaction(tags, transaction?: Transaction) {
        return await this.tagRepository.findTagsByArrayOfNameAndColorWithTransaction(tags, transaction)
    }
}
