import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Query, Param, HttpStatus, HttpException, Put, UsePipes, Inject, ValidationPipe
} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {AddTagDto} from "./dto/add-tag.dto";
// import {ValidationPipe} from "../validation.pipe";
import {Transaction} from "sequelize";
// import {AddTagsDto} from "./dto/add-tags.dto";
// import { Transaction } from 'sequelize-transactional-cls-hooked';

@ApiTags("Users")
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: "Getting all users" })
    @ApiResponse({ status: 200, type: [User] })
    // @UseGuards(JwtAuthGuard)
    @Get('get-all-users')
    GetAllUsers() {
        try {
            return this.usersService.GetAllUsers();
        } catch (e) {
            throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('find-by-tags')
    @UseGuards(JwtAuthGuard)
    async getUsersByTags(@Query('tagIds') tagIds: string, @Request() req): Promise<User[]> {
        try {
            const tagIdArr = tagIds.split(',').map((id) => parseInt(id, 10));
            return this.usersService.getUsersByTagIds(tagIdArr, req.user.id);
        } catch (e) {
            console.log('!!! err = ', e)
        }
    }

    @ApiOperation({ summary: "Getting user by id" })
    @ApiResponse({ status: 200, type: User })
    @Get(':id')
    async getUserById(@Param('id') id: number): Promise<User> {
        return await this.usersService.getUserById(id);
    }

    @ApiOperation({ summary: "User creation" })
    @ApiResponse({ status: 200, type: User })
    @UsePipes(ValidationPipe)
    @Post('create-user')
    async createUser(@Body() userDto: CreateUserDto) {
        return await this.usersService.createUser(userDto);
    }

    @Put('add-tag-to-user')
    @UseGuards(JwtAuthGuard)
    addTagToUser(@Body() dto: AddTagDto, @Request() req) {
        return this.usersService.addTagToUser(dto, req);
    }

    @Put('add-tags-to-user')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard)
    addTagToAuthUserByTwoTagsFields(@Body() dto: AddTagDto[], @Request() req) {
        return this.usersService.addTagsToUser(dto, req.user.id);
    }

}

