import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./users.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {AddTagDto} from "./dto/add-tag.dto";
import {TagsService} from "../tags/tags.service";
import {UserTags} from "../tags/user-tags.model";
import {Tag} from "../tags/tags.model";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(UserTags) private user_tagRepository: typeof UserTags,
        private tagService: TagsService
    ) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        return user;
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({ include: { all: true } });
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            include: { all: true },
        });
        return user;
    }

    async getUserProfile(userId) {
        const user = await this.userRepository.findOne({where: { id: userId }});
        return user;
    }

    async addTag(dto: AddTagDto, req) {

        try {
            const user = await this.userRepository.findByPk(req.user.id);
            const tag = await this.tagService.getTagByNameAndColor(dto.name, dto.color);
            const alreadyExists = await this.user_tagRepository.findOne({where: {userId: user.id, tagId: tag.id}})

            if (alreadyExists) {
                throw new HttpException("Already exists", HttpStatus.BAD_REQUEST)
            }

            if (tag && user) {
                await user.$add("tag", tag.id);
                return dto;
            }
            throw new HttpException("User or tag not found", HttpStatus.NOT_FOUND);
        } catch (e) {
            console.log('!!! ERROR = ', e.message, 'ALL !!!')
            throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    async getUsersByTags(tagId) {
    //     // const users = await this.userRepository.findAll({
    //     //     where: {},
    //     //     include: [{
    //     //         model: Tag,
    //     //         as: 'tags',
    //     //         attributes: ['id']
    //     //     }]
    //     // })
    //     // console.log('!!! users = ', users[0].id)
    //     // console.log('!!! users.length = ', users.length)
    //     // return users;
    }

    async findByTagIds(tagIds: number[]): Promise<User[]> {
        return this.userRepository.findAll({
            include: [
                {
                    model: Tag,
                    where: {
                        id: tagIds
                    }
                }
            ]
        });
    }

}

