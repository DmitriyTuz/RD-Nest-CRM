import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Post } from "./posts.model";
import { FilesService } from "../files/files.service";

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private fileService: FilesService

  ) {}

  async create(dto: CreatePostDto, image: any) {
    // try {
    let notUniqueTitle = await this.postRepository.findOne({ where: { title: dto.title } });
    // let notUniqueTitle = await this.postService.getPostByTitle(dto.title)
    if (notUniqueTitle) {
      throw new HttpException(
        "A post with the same name already exists in the database",
        HttpStatus.BAD_REQUEST
      );
    }
    const fileName = await this.fileService.createFile(image);
    const post = await this.postRepository.create({ ...dto, image: fileName });
    return post;
    // } catch (e) {
    //     console.log(e)
    // }
  }

  async getPostByTitle(title: string) {
    const post = await this.postRepository.findOne({ where: { title } });
    return post;
  }
}
