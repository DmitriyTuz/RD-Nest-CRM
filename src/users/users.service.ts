import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {AddTagDto} from "./dto/add-tag.dto";
import {TagsService} from "../tags/tags.service";
import {Tag} from "../tags/tags.model";
import {Op} from 'sequelize';
import {UserRepository} from "./users.repository";
import {UserTags} from "../tags/user-tags.model";
import {User} from "./users.model";

@Injectable()
export class UsersService {

    constructor(private readonly userRepository: UserRepository,
                private tagService: TagsService,
                @InjectModel(UserTags) private userTagRepository: typeof UserTags

    ) {
    }

    async GetAllUsers() {
        return await this.userRepository.findAll();
    }

    async getUserById(id) {
        return this.userRepository.getUserById(id);
    }

    async createUser(dto: CreateUserDto) {
        try {
            return await this.userRepository.createUser(dto);
        } catch (e) {
            throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    async getUserByEmail(email: string) {
        return await this.userRepository.getUserByEmail(email);
    }

    async deleteUserById(id) {
        return await this.userRepository.deleteUserById(id);
    }

    async deleteUserByEmail(email: string) {
        return await this.userRepository.deleteUserByEmail(email);
    }

    async addTagToUser(dto: AddTagDto, req) {

        try {
            const user = await this.userRepository.findByPk(req.user.id);
            const tag = await this.tagService.getTagByNameAndColor(dto.name, dto.color);

            const alreadyExists = await this.userTagRepository.findOne({where: {userId: user.id, tagId: tag.id}})

            if (alreadyExists) {
                throw new HttpException("Already exists", HttpStatus.BAD_REQUEST)
            }

            if (tag && user) {
                await user.$add("tag", tag.id);
                return dto;
            }
            throw new HttpException("User or tag not found", HttpStatus.NOT_FOUND);
        } catch (e) {
            throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    async addTagsToUser(dto: AddTagDto[], currentUserId): Promise<void> {
        try {
            const user = await this.userRepository.findByPk(currentUserId);
            if (!user) {
                throw new HttpException("User not found", HttpStatus.NOT_FOUND);
            }

            for (let tag of dto) {
                if (typeof(tag.name) !== 'string' || !tag.name) {
                    throw new HttpException(`Name must be a string and not empty`, HttpStatus.BAD_REQUEST)
                }
                if (typeof(tag.color) !== 'string' || !tag.color) {
                    throw new HttpException(`Color must be a string and not empty`, HttpStatus.BAD_REQUEST)
                }
            }

            const arrayFoundsTags: Tag[] = await this.tagService.findTagsByArrayOfNameAndColor(dto)
            const arrayNotFoundsTags: any = dto.filter(item1 => !arrayFoundsTags.some(item2 => item1['name'] === item2.name && item1['color'] === item2.color));
            const arrayForBulkCreate = arrayNotFoundsTags.map((tag) => ({ ...tag, ownerId: currentUserId }));
            await this.tagService.bulkCreateTags(arrayForBulkCreate);

            await this.userTagRepository.destroy({
                where: {
                    userId: currentUserId,
                },
            });

            const arrayFoundsTagsAfterCreate: Tag[] = await this.tagService.findTagsByArrayOfNameAndColor(dto)
            const currentUserTagEntities = arrayFoundsTagsAfterCreate.map(tag => ({
                userId: currentUserId,
                tagId: tag.id
            }));

            await this.userTagRepository.bulkCreate(currentUserTagEntities);

// with no bulkCreate
            // const user = await this.userRepository.findByPk(currentUserId);
            // console.log('user = ', user)
            //
            // for (let tag of arrayFoundsTagsAfterCreate) {
            //     await user.$add("tag", tag.id);
            // }

        } catch (e) {
            console.log('!!! ERROR in addTags - ', e);
            throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
        }

    }

    async getUsersByTagIds(tagIds: number[], userId): Promise<User[]> {
        return User.findAll({
            where: {
                id: {[Op.not]: userId},
            },
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


