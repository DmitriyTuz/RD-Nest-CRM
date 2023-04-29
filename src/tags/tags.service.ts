import {ExecutionContext, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Tag} from "./tags.model";
import {CreateTagDto} from "./dto/create-tag.dto";

@Injectable()
export class TagsService {

    constructor(
        @InjectModel(Tag) private tagRepository: typeof Tag
    ) {}

    async createTag(dto: CreateTagDto, userId) {
        const tag = await this.tagRepository.create({...dto, tagCreatorId: userId});
        return tag;
    }

    async getAllTags() {
        const tags = await this.tagRepository.findAll({ include: { all: true } });
        return tags;
    }

    async getTagById(id: number) {
        const user = await this.tagRepository.findOne({where: { id }});
        return user;
    }
}
