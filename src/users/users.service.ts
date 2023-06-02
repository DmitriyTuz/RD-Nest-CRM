import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {AddTagDto} from "./dto/add-tag.dto";
import {TagsService} from "../tags/tags.service";
import {Tag} from "../tags/tags.model";
import {Op, Transaction} from 'sequelize';
import {UserRepository} from "./users.repository";
import {UserTags} from "../tags/user-tags.model";
import {User} from "./users.model";

@Injectable()
export class UsersService {

    private transaction: Transaction | null = null;

    constructor(private readonly userRepository: UserRepository,
                private tagService: TagsService,
                @InjectModel(UserTags) private userTagRepository: typeof UserTags

    ) {
    }

    setTransaction(transaction: Transaction) {
        this.transaction = transaction;
    }

    getTransaction(): Transaction | null {
        return this.transaction;
    }

    async GetAllUsers() {
        return await this.userRepository.findAll();
    }

    async GetAllUsersWithTransaction(transaction?: Transaction) {
        return await this.userRepository.GetAllUsersWithTransaction(transaction);
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

    async createUserWithTransaction(dto: CreateUserDto, transaction?: Transaction) {
        try {
            return await this.userRepository.createUserWithTransaction(dto, transaction);
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

    async addTagsToAuthUserByTwoTagsFields(tags: { name: string, color: string }[], currentUserId): Promise<void> {

        try {

            const arrayFoundsTags: Tag[] = await this.tagService.findTagsByArrayOfNameAndColor(tags)

            const arrayNotFoundsTags: any = tags.filter(item1 => !arrayFoundsTags.some(item2 => item1.name === item2.name && item1.color === item2.color));

            const arrayForBulkCreate = arrayNotFoundsTags.map((tag) => {
                const tagEq = {name: '', color: '', ownerId: 0}
                tagEq.ownerId = currentUserId;
                tagEq.name = tag.name;
                tagEq.color = tag.color;
                return tagEq;
            });

            await this.tagService.bulkCreateTags(arrayForBulkCreate);

            const arrayFoundsTagsAfterCreate: Tag[] = await this.tagService.findTagsByArrayOfNameAndColor(tags)

            await this.userTagRepository.destroy({
                where: {
                    userId: currentUserId,
                },
            });

            const currentUserTagEntities = arrayFoundsTagsAfterCreate.map((tag) => {
                const userTag = {userId: 0, tagId: 0}
                userTag.userId = currentUserId;
                userTag.tagId = tag.id;
                return userTag;
            });

            await this.userTagRepository.bulkCreate(currentUserTagEntities);

        } catch (e) {
            console.log('!!! ERROR in addTags - ', e);
            throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
        }

    }

    async addTagsToAuthUserByTwoTagsFieldsWithNoBulk(tags: { name: string, color: string }[], currentUserId): Promise<void> {

        try {

            const arrayFoundsTags: Tag[] = await this.tagService.findTagsByArrayOfNameAndColor(tags)

            const arrayNotFoundsTags: any = tags.filter(item1 => !arrayFoundsTags.some(item2 => item1.name === item2.name && item1.color === item2.color));

            const arrayForBulkCreate = arrayNotFoundsTags.map((tag) => {
                const tagEq = {name: '', color: '', ownerId: 0}
                tagEq.ownerId = currentUserId;
                tagEq.name = tag.name;
                tagEq.color = tag.color;
                return tagEq;
            });

            await this.tagService.bulkCreateTags(arrayForBulkCreate);

            const arrayFoundsTagsAfterCreate: Tag[] = await this.tagService.findTagsByArrayOfNameAndColor(tags)

            await this.userTagRepository.destroy({
                where: {
                    userId: currentUserId,
                },
            });

            const user = await this.userRepository.findByPk(currentUserId);
            console.log('user = ', user)

            for (let tag of arrayFoundsTagsAfterCreate) {
                await user.$add("tag", tag.id);
            }

        } catch (e) {
            console.log('!!! ERROR in addTags - ', e);
            throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
        }

    }

    async addTagsWithTransaction(tags: { name: string, color: string }[], currentUserId, transaction?: Transaction): Promise<void> {

        try {

            // console.log('process.env.NODE_ENV = ', process.env.NODE_ENV)
            // if (process.env.NODE_ENV == 'test') {
            //     let sequelize = new Sequelize(sequelizeConfig)
            //     transaction = await sequelize.transaction();
            // }

            // const arrayFoundsTags: Tag[] = await this.tagService.findTagsByArrayOfNameAndColor(tags)
            const arrayFoundsTags: Tag[] = await this.tagService.findTagsByArrayOfNameAndColorWithTransaction(tags, transaction)

            const arrayNotFoundsTags: any = tags.filter(item1 => !arrayFoundsTags.some(item2 => item1.name === item2.name && item1.color === item2.color));

            const arrayForBulkCreate = arrayNotFoundsTags.map((tag) => {
                const tagEq = {name: '', color: '', ownerId: 0}
                tagEq.ownerId = currentUserId;
                tagEq.name = tag.name;
                tagEq.color = tag.color;
                return tagEq;
            });

            console.log('!!! arrayForBulkCreate = ', arrayForBulkCreate);

            let t = await this.tagService.bulkCreateTagsWithTransaction(arrayForBulkCreate, transaction);
            console.log('!!! t = ', t);

            const arrayFoundsTagsAfterCreate: Tag[] = await this.tagService.findTagsByArrayOfNameAndColorWithTransaction(tags, transaction)

            console.log('!!! arrayFoundsTagsAfterCreate = ', arrayFoundsTagsAfterCreate);

            await this.userTagRepository.destroy({
                where: {
                    userId: currentUserId,
                }, transaction
            });

            const currentUserTagEntities = arrayFoundsTagsAfterCreate.map((tag) => {
                const userTag = {userId: 0, tagId: 0}
                userTag.userId = currentUserId;
                userTag.tagId = tag.id;
                return userTag;
            });

            console.log('!!! currentUserTagEntities = ', currentUserTagEntities);
            // console.log('!!! transaction3.id = ', transaction['id'])

            let r = await this.userTagRepository.bulkCreate(currentUserTagEntities, { transaction } );
            console.log('!!! r = ', r);

            // if (process.env.NODE_ENV == 'test') {
            //     await transaction.commit()
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

    async addTagsToAuthUserByTwoTagsFieldsTest(tags: { name: string, color: string }[], currentUserId): Promise<void> {

        try {

            const arrayFoundsTags: Tag[] = await this.tagService.findTagsByArrayOfNameAndColor(tags)

            const arrayNotFoundsTags: any = tags.filter(item1 => !arrayFoundsTags.some(item2 => item1.name === item2.name && item1.color === item2.color));

            const arrayForBulkCreate = arrayNotFoundsTags.map((tag) => {
                const tagEq = {name: '', color: '', ownerId: 0}
                tagEq.ownerId = currentUserId;
                tagEq.name = tag.name;
                tagEq.color = tag.color;
                return tagEq;
            });

            await this.tagService.bulkCreateTags(arrayForBulkCreate);

            // const arrayFoundsTagsAfterCreate: Tag[] = await this.tagService.findTagsByArrayOfNameAndColor(tags)

            const user = await User.findByPk(currentUserId, { include: [Tag] });
            if (!user) {
                // Обработка случая, если пользователь не найден
                throw new HttpException(`User not found`, HttpStatus.NOT_FOUND)
                // throw new NotFoundException('User not found');
            }

            const existingTags = user.tags || [];
            const existingTagNames = existingTags.map(tag => tag.name);
            const existingTagColors = existingTags.map(tag => tag.color);

            const newTags = tags.filter(tag => {
                return !existingTagNames.includes(tag.name) || !existingTagColors.includes(tag.color);
            });

            const arrayTagsForAdd: Tag[] = await this.tagService.findTagsByArrayOfNameAndColor(newTags)
            await user.$add('tags', arrayTagsForAdd);

        } catch (e) {
            console.log('!!! ERROR in addTags - ', e);
            throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
        }

    }
}


