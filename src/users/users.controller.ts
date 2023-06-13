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
import {ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {TagDto} from "./dto/add-tag.dto";
import {Tag} from "../tags/tags.model";

@ApiTags("Users")
@ApiExtraModels(TagDto)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('get-all-users')
    @ApiOperation({ summary: "Getting all users" })
    @ApiResponse({ status: 200, type: [User] })
    GetAllUsers() {
        try {
            return this.usersService.GetAllUsers();
        } catch (e) {
            throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
        }
    }

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
    searchUsersByTags(@Query('tags') tags: string, @Request() req): Promise<User[]> {
        const parsedTags = JSON.parse(tags) as TagDto[];
        return this.usersService.searchUsersByTags(parsedTags, req.user.id);
    }

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
    filterUsersByTags(@Query('tags') tags: string, @Request() req): Promise<User[]> {
        const parsedTags = JSON.parse(tags) as TagDto[];
        return this.usersService.filterUsersByTags(parsedTags, req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: "Getting user by id" })
    @ApiResponse({ status: 200, type: User })
    getUserById(@Param('id') id: number): Promise<User> {
        return this.usersService.getUserById(id);
    }

    @Post('create-user')
    @ApiOperation({ summary: "User creation" })
    @ApiResponse({ status: 200, type: User })
    @UsePipes(ValidationPipe)
    createUser(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    @Put('add-tag-to-user')
    @UseGuards(JwtAuthGuard)
    addTagToUser(@Body() dto: TagDto, @Request() req) {
        return this.usersService.addTagToUser(dto, req);
    }

    @Put('add-tags-to-user')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: "Add tags to his profile by an authorized user" })
    @ApiBody({ type: [TagDto] })
    @ApiResponse({
        status: 200,
        description: 'Successfully added tags'
    })
    addTagsToUser(@Body() dto: TagDto[], @Request() req) {
        return this.usersService.addTagsToUser(dto, req.user.id);
    }



}

