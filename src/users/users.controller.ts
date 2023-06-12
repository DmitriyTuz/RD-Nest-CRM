import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Query, Param, HttpStatus, HttpException, Put, UsePipes, ValidationPipe
} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {TagDto} from "./dto/add-tag.dto";

@ApiTags("Users")
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: "Getting all users" })
    @ApiResponse({ status: 200, type: [User] })
    @Get('get-all-users')
    GetAllUsers() {
        try {
            return this.usersService.GetAllUsers();
        } catch (e) {
            throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    // @Get('find-user-by-tags')
    // @UseGuards(JwtAuthGuard)
    // async getUsersByTags(@Query('tagIds') tagIds: string, @Request() req): Promise<User[]> {
    //     try {
    //         const tagIdArr = tagIds.split(',').map((id) => parseInt(id, 10));
    //         return this.usersService.getUsersByTagIds(tagIdArr, req.user.id);
    //     } catch (e) {
    //         console.log('!!! err = ', e)
    //     }
    // }

    @Get('search-users-by-tags')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: "Search by authorized user of users by tags" })
    @ApiQuery({
        name: 'tags',
        type: 'string',
        required: true,
        example: '[{"name":"Education","color":"green"},{"name":"Nature10","color":"gold"}]',
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved users',
        type: User,
        isArray: true,
    })
    async searchUsersByTags(@Query('tags') tags: string, @Request() req): Promise<User[]> {
        const parsedTags = JSON.parse(tags) as TagDto[];
        return await this.usersService.searchUsersByTags(parsedTags, req.user.id);
    }

    // use in postman !!! - GET /users/search?tags[0][name]=Education&tags[0][color]=green&tags[1][name]=Nature10&tags[1][color]=gold
    @Get('filter-users-by-tags')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: "Filter by authorized user of users by tags" })
    @ApiQuery({
        name: 'tags',
        type: 'string',
        required: true,
        example: '[{"name":"Education","color":"green"},{"name":"Nature10","color":"gold"}]',
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved users',
        type: User,
        isArray: true,
    })
    async filterUsersByTags(@Query('tags') tags: string, @Request() req): Promise<User[]> {
        const parsedTags = JSON.parse(tags) as TagDto[];
        return await this.usersService.filterUsersByTags(parsedTags, req.user.id);
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
    addTagToUser(@Body() dto: TagDto, @Request() req) {
        return this.usersService.addTagToUser(dto, req);
    }

    @Put('add-tags-to-user')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard)
    addTagsToUser(@Body() dto: TagDto[], @Request() req) {
        return this.usersService.addTagsToUser(dto, req.user.id);
    }

}

