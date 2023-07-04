import {Injectable} from '@nestjs/common';
import {TagRepository} from "./tags.repository";

@Injectable()
export class TagsService {

    // constructor(
    //     @InjectModel(Tag) private tagRepository: typeof Tag
    // ) {}

    constructor(private readonly tagRepository: TagRepository) {}

    async getAllTags() {
        return await this.tagRepository.findAll();
    }

    async getTagById(id: number) {
        return await this.tagRepository.getTagById(id);
    }

    async getTagByNameAndColor(name: string, color: string) {
        return await this.tagRepository.getTagByNameAndColor(name, color);
    }

    async createUserTag(dto, id) {
        return await this.tagRepository.createUserTag(dto, id);
    }

    async createTagOfOrder(dto, id) {
        return await this.tagRepository.createTagOfOrder(dto, id);
    }

    async bulkCreateTags(arrayForBulkCreate: any) {
        await this.tagRepository.bulkCreateTags(arrayForBulkCreate)
    }

    async findTagsByArrayOfNameAndColor(tags) {
        return await this.tagRepository.findTagsByArrayOfNameAndColor(tags)
    }

    async updateUserTag(tagId, dto, currentUserId) {
        return await this.tagRepository.updateUserTag(tagId, dto, currentUserId);
    }

    async deleteUserTag(tagId, currentUserId) {
        return await this.tagRepository.deleteUserTag(tagId, currentUserId);
    }

    async deleteTagOfOrder(tagId, orderId, currentUserId) {
        return await this.tagRepository.deleteTagOfOrder(tagId, orderId, currentUserId);
    }
}
