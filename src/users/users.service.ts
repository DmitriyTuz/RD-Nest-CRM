import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./users.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {AddTagDto} from "./dto/add-tag.dto";
import {TagsService} from "../tags/tags.service";
import {Tag} from "../tags/tags.model";
import { Op } from 'sequelize';
import {UserRepository} from "./users.repository";

@Injectable()
export class UsersService {
    // constructor(
    //     @InjectModel(User) private userRepository: typeof User,
    //     // @InjectModel(UserTags) private user_tagRepository: typeof UserTags,
    // ) {}

    constructor(private readonly userRepository: UserRepository,
                private tagService: TagsService
    ) {}

    async GetAllUsers() {
        const users = await this.userRepository.findAll();
        return users;
    }

    async getUserById(id) {
        const user = await this.userRepository.getUserById(id);
        return user;
    }

    async getUserProfile(userId) {
        const user = await this.userRepository.getUserById({where: { id: userId }});
        return user;
    }

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.createUser(dto);
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.getUserByEmail(email);
        return user;
    }

    async deleteUserByEmail(email: string) {
        const user = await this.userRepository.deleteUserByEmail(email);
        return user;
    }

    async addTagToUser(dto: AddTagDto, req) {

        try {
            const user = await this.userRepository.findByPk(req.user.id);
            const tag = await this.tagService.getTagByNameAndColor(dto.name, dto.color);
            // const alreadyExists = await this.user_tagRepository.findOne({where: {userId: user.id, tagId: tag.id}})
            //
            // if (alreadyExists) {
            //     throw new HttpException("Already exists", HttpStatus.BAD_REQUEST)
            // }

            if (tag && user) {
                await user.$add("tag", tag.id);
                return dto;
            }
            throw new HttpException("User or tag not found", HttpStatus.NOT_FOUND);
        } catch (e) {
            throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    // async getUsersByTagIds(tagIds: number[], userId): Promise<User[]> {
    //     return this.userRepository.findAll({
    //         where: {
    //             id: {[Op.not]: userId},
    //         },
    //         include: [
    //             {
    //                 model: Tag,
    //                 where: {
    //                     id: tagIds
    //                 }
    //             }
    //         ]
    //     });
    // }

}


