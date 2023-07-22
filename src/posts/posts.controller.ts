import {
  Body,
  Controller, Get, Param, Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import {Posts} from "./posts.model";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostsService } from "./posts.service";
import { FileInterceptor } from "@nestjs/platform-express";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags("Posts")
@Controller("posts")
export class PostsController {
  constructor(private postService: PostsService) {}

  @Post('/create-post')
  @ApiOperation({ summary: "Post creation" })
  @ApiResponse({ status: 200, type: Posts })
  @UseInterceptors(FileInterceptor("image"))
  createPost(@Body() dto: CreatePostDto, @UploadedFile() image) {
    return this.postService.create(dto, image);
  }

  @Get("/:title")
  @ApiOperation({ summary: "Get post by title" })
  @ApiResponse({ status: 200, type: Posts })
  getByTitle(@Param("title") title: string) {
    return this.postService.getPostByTitle(title);
  }

}
