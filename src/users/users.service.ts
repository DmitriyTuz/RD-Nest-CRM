import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./users.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {AddTagDto} from "./dto/add-tag.dto";
import {TagsService} from "../tags/tags.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
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
        const user = await this.userRepository.findByPk(req.user.id);
        const tag = await this.tagService.getTagByNameAndColor(dto.name, dto.color);
        if (tag && user) {
            await user.$add("tag", tag.id);
            return dto;
        }
        throw new HttpException("User or tag not found", HttpStatus.NOT_FOUND);
    }
}

