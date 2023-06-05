import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class AddTagDto {
    @ApiProperty({ example: "Hobby", description: "any tag name" })
    @IsString({ message: "Must be a string" })
    name: string;

    @ApiProperty({ example: "red", description: "any tag color" })
    @IsString({ message: "Must be a string" })
    color: string;

}