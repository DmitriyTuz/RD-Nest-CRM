import {Body, Controller, Get, Post} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TagsService} from "./tags.service";
import {Tag} from "./tags.model";
import {CreateTagDto} from "./dto/create-tag.dto";

@ApiTags("Tags")
@Controller('tags')
export class TagsController {
    constructor(private tagsService: TagsService) {}

    @ApiOperation({ summary: "Tag creation" })
    @ApiResponse({ status: 200, type: Tag })
    @Post()
    create(@Body() tagDto: CreateTagDto) {
        return this.tagsService.createTag(tagDto);
    }

    @ApiOperation({ summary: "Getting all tags" })
    @ApiResponse({ status: 200, type: [Tag] })
    @Get()
    getAll() {
        return this.tagsService.getAllUsers();
    }
}