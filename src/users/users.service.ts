import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {TagDto} from "./dto/add-tag.dto";
import {TagsService} from "../tags/tags.service";
import {Tag} from "../tags/tags.model";
import {Op, Sequelize} from 'sequelize';
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

    async addTagToUser(dto: TagDto, req) {

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

    async addTagsToUser(dto: TagDto[], currentUserId): Promise<void> {
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

    // async searchUsersByTags(tags: TagDto[]): Promise<User[]> {
    //
    //     try {
    //         const users = await User.findAll({
    //             attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    //             include: [
    //                 {
    //                     model: Tag,
    //                     as: 'tags',
    //                     // through: { attributes: [] },
    //                     where: {
    //                         [Op.and]: tags.map((tag) => ({
    //                             name: tag.name,
    //                             color: tag.color,
    //                         })),
    //                     },
    //                     through: { attributes: [] }
    //                 },
    //             ],
    //             group: ['User.id', 'User.name', 'User.email', 'User.createdAt', 'User.updatedAt'], // Группируем по идентификатору пользователя
    //             having: Sequelize.literal(`COUNT(DISTINCT tags.id) = ${tags.length}`)
    //         });
    //
    //         return users;
    //     } catch (e) {
    //         console.log('!!! ERROR in searchUsersByTags - ', e);
    //         throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
    //     }
    //
    // }

    // async searchUsersByTags(tags: TagDto[]): Promise<User[]> {
    //     try {
    //         const users = await User.findAll({
    //             include: [
    //                 {
    //                     model: Tag,
    //                     as: 'tags',
    //                     where: {
    //                         [Op.and]: tags.map((tag) => ({
    //                             name: tag.name,
    //                             color: tag.color,
    //                         })),
    //                     },
    //                     through: { attributes: [] }, // Используйте эту опцию, чтобы исключить атрибуты связи (UserTags)
    //                 },
    //             ],
    //             group: ['User.id', 'tags.id'], // Добавьте группировку по id пользователей и id тегов
    //             having: Sequelize.literal(`COUNT(DISTINCT tags.id) = ${tags.length}`), // Используйте "tags.id" для агрегатной функции
    //         });
    //
    //         return users;
    //     } catch (e) {
    //         console.log('!!! ERROR in searchUsersByTags - ', e);
    //         throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
    //     }
    // }

    // async searchUsersByTags(tags: TagDto[]): Promise<User[]> {
    //     try {
    //         const users = await User.findAll({
    //             include: [
    //                 {
    //                     model: Tag,
    //                     as: 'tags',
    //                     where: {
    //                         [Op.or]: tags.map((tag) => ({
    //                             [Op.and]: [{ name: tag.name }, { color: tag.color }],
    //                         })),
    //                     },
    //                     through: { attributes: [] },
    //                 },
    //             ],
    //             group: ['User.id', 'tags.id'],
    //             having: Sequelize.literal(`COUNT(DISTINCT tags.id) = ${tags.length}`),
    //         });
    //
    //         return users;
    //     } catch (e) {
    //         console.log('!!! ERROR in searchUsersByTags - ', e);
    //         throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
    //     }
    // }

    // async searchUsersByTags(tags: TagDto[]): Promise<User[]> {
    //     try {
    //         const tagIds = await Tag.findAll({
    //             where: {
    //                 [Op.and]: tags.map((tag) => ({
    //                     name: tag.name,
    //                     color: tag.color,
    //                 })),
    //             },
    //             attributes: ['id'], // Получаем только идентификаторы тегов
    //         });
    //
    //         const tagIdsArray = tagIds.map((tag) => tag.id);
    //
    //         const users = await User.findAll({
    //             include: [
    //                 {
    //                     model: Tag,
    //                     as: 'tags',
    //                     where: {
    //                         id: {
    //                             [Op.in]: tagIdsArray, // Ищем пользователей, у которых есть все найденные теги
    //                         },
    //                     },
    //                     through: { attributes: [] },
    //                 },
    //             ],
    //             group: ['User.id', 'tags.id'], // Группируем только по идентификатору пользователя
    //             having: Sequelize.literal(`COUNT(DISTINCT tags.id) = ${tags.length}`),
    //         });
    //
    //         return users;
    //     } catch (e) {
    //         console.log('!!! ERROR in searchUsersByTags - ', e);
    //         throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
    //     }
    // }

    async searchUsersByTags(tags: TagDto[]): Promise<User[]> {
        try {

            const tagConditions = tags.map((tag) => ({
                [Op.and]: [
                    { name: tag.name },
                    { color: tag.color },
                ],
            }));

            const tagIds = await Tag.findAll({
                where: {
                    [Op.or]: tagConditions,
                },
                attributes: ['id'], // Получаем только идентификаторы тегов
            });

            const tagIdsArray = tagIds.map((tag) => tag.id);

            const users = await User.findAll({
                where: {
                    id: {
                        [Op.in]: Sequelize.literal(`(
                            SELECT "userId" FROM "user_tags" WHERE "tagId" IN (${tagIdsArray.join(',')})
                            GROUP BY "userId"
                            HAVING COUNT(DISTINCT "tagId") = ${tagIdsArray.length}
                        )`),
                    },
                },

                include: [
                    {
                        model: Tag,
                        as: 'tags',
                        where: {
                            id: {
                                [Op.in]: tagIdsArray, // Ищем пользователей, у которых есть все найденные теги
                            },
                        },
                        through: { attributes: [] },
                    },
                ],
                // group: ['User.id', 'user_tags'], // Группируем только по идентификатору пользователя
                // having: Sequelize.literal(`COUNT(DISTINCT tags.id) = ${tags.length}`),
            });

            return users;
        } catch (e) {
            console.log('!!! ERROR in searchUsersByTags - ', e);
            throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
        }
    }

}


