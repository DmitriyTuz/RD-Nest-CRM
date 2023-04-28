import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Tag} from "./tags.model";
import {CreateTagDto} from "./dto/create-tag.dto";

@Injectable()
export class TagsService {

    constructor(
        @InjectModel(Tag) private tagRepository: typeof Tag
    ) {}

    async createTag(dto: CreateTagDto) {
        const tag = await this.tagRepository.create(dto);
        return tag;
    }

    async getAllUsers() {
        const tags = await this.tagRepository.findAll({ include: { all: true } });
        return tags;
    }
}
