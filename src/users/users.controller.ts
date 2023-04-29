import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Response,
    createParamDecorator,
    ExecutionContext
} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

import { AuthGuard } from '@nestjs/passport';

const UserP = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

@ApiTags("Users")
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: "User creation" })
    @ApiResponse({ status: 200, type: User })
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    @ApiOperation({ summary: "Getting all users" })
    @ApiResponse({ status: 200, type: [User] })
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.usersService.getAllUsers();
    }

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    getUserProfile(@Request() req) {
        return this.usersService.getUserProfile(req.user.id);

    }

    // @Post("/tag")
    // addTag(@Body() dto: AddTagDto) {
    //     return this.usersService.addTag(dto);
    // }

}

