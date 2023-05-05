import {Body, Controller, Get, Param, Post, Request, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TagsService} from "./tags.service";
import {Tag} from "./tags.model";
import {CreateTagDto} from "./dto/create-tag.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@ApiTags("Tags")
@Controller('tags')
export class TagsController {
    constructor(private tagsService: TagsService) {}

    // @ApiOperation({ summary: "Tag creation" })
    // @ApiResponse({ status: 200, type: Tag })
    // @UseGuards(JwtAuthGuard)
    // @Post('/create-tag')
    // create(@Body() tagDto: CreateTagDto, @Request() req) {
    //     return this.tagsService.createTag(tagDto, req.user.id);
    // }

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


}