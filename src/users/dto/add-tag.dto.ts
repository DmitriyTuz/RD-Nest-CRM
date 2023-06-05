import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class TagDto {
    @ApiProperty({ example: "Hobby", description: "any tag name" })
    @IsString({ message: "Must be a string" })
    readonly name: string;

    @ApiProperty({ example: "red", description: "any tag color" })
    @IsString({ message: "Must be a string" })
    readonly color: string;

}