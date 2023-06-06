import {Injectable} from '@nestjs/common';
import {CreateTagDto} from "./dto/create-tag.dto";
import {TagRepository} from "./tags.repository";

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
        return await this.tagRepository.findAll();
    }

    async getTagById(id: number) {
        return await this.tagRepository.getTagById(id);
    }

    async getTagByNameAndColor(name: string, color: string) {
        return await this.tagRepository.getTagByNameAndColor(name, color);
    }

    async createTag(dto: CreateTagDto, currentUserId) {
        return await this.tagRepository.createTag(dto, currentUserId);
    }

    async bulkCreateTags(arrayForBulkCreate: any) {
        await this.tagRepository.bulkCreateTags(arrayForBulkCreate)
    }

    async findTagsByArrayOfNameAndColor(tags) {
        return await this.tagRepository.findTagsByArrayOfNameAndColor(tags)
    }

}
