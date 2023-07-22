import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class CreatePostDto {
  @ApiProperty({ example: "My comments", description: "post title" })
  @IsString({ message: "Must be a string" })
  readonly title: string;

  @ApiProperty({ example: "Any content", description: "post content" })
  @IsString({ message: "Must be a string" })
  readonly content: string;

  @ApiProperty({ example: "Any number", description: "author id" })
  @IsNumber()
  readonly userId: number;
}
