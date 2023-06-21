import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    Request,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TagsService} from "./tags.service";
import {Tag} from "./tags.model";
import {CreateTagDto} from "./dto/create-tag.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {TagDto} from "../users/dto/add-tag.dto";
import {UpdateTagDto} from "./dto/update-tag.dto";

@ApiTags("Tags")
@Controller('tags')
export class TagsController {
    constructor(private tagsService: TagsService) {}

    @Post('/create-user-tag')
    @ApiOperation({ summary: "Tag creation" })
    @ApiResponse({ status: 200, type: Tag })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    createUserTag(@Body() tagDto: CreateTagDto, @Req() req) {
        return this.tagsService.createUserTag(tagDto, req.user.id);
    }

    @ApiOperation({ summary: "Getting all tags" })
    @ApiResponse({ status: 200, type: [Tag] })
    @Get()
    getAll() {
        return this.tagsService.getAllTags();
    }

    // @ApiOperation({ summary: "Getting tag by id" })
    // @ApiResponse({ status: 200, type: Tag })
    // @Get('/:id')
    // getById(@Param("id") id: number) {
    //     return this.tagsService.getTagById(id);
    // }

    @Put('/update-user-tag/:id')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: "Tag update" })
    updateUserTag(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto, @Request() req): Promise<void> {
        return this.tagsService.updateUserTag(id, updateTagDto, req.user.id);
    }

    @Delete('/delete-user-tag/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: "Tag remove" })
    deleteUserTag(@Param('id') id: number, @Request() req): Promise<void> {
        return this.tagsService.deleteUserTag(id, req.user.id);
    }

}