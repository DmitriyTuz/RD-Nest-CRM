import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Query, Param
} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {AddTagDto} from "./dto/add-tag.dto";

@ApiTags("Users")
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: "Getting all users" })
    @ApiResponse({ status: 200, type: [User] })
    // @UseGuards(JwtAuthGuard)
    @Get('get-all-users')
    findAll() {
        return this.usersService.findAll();
    }

    // @Get('find-by-tags')
    // @UseGuards(JwtAuthGuard)
    // async getUsersByTags(@Query('tagIds') tagIds: string, @Request() req): Promise<User[]> {
    //     try {
    //         const tagIdArr = tagIds.split(',').map((id) => parseInt(id, 10));
    //         return this.usersService.getUsersByTagIds(tagIdArr, req.user.id);
    //     } catch (e) {
    //         console.log('!!! err = ', e)
    //     }
    // }

    @ApiOperation({ summary: "Getting user by id" })
    @ApiResponse({ status: 200, type: User })
    @Get(':id')
    // @UseGuards(JwtAuthGuard)
    getUserById(@Param('id') id: number) {
        return this.usersService.getUserById(id);
    }

    @ApiOperation({ summary: "Getting current user (only after login !)" })
    @ApiResponse({ status: 200, type: User })
    @Get('get-current-user')
    @UseGuards(JwtAuthGuard)
    getUserProfile(@Request() req) {
        return this.usersService.getUserProfile(req.user.id);
    }

    @ApiOperation({ summary: "User creation" })
    @ApiResponse({ status: 200, type: User })
    @Post('create-user')
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    // @Post('add-tag')
    // @UseGuards(JwtAuthGuard)
    // addTag(@Body() dto: AddTagDto, @Request() req) {
    //     return this.usersService.addTag(dto, req);
    // }

}

