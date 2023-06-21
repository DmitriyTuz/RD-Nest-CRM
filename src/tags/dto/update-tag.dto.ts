import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class UpdateTagDto {

    @ApiProperty({ example: "Education", description: "any tag name" })
    @IsString({ message: "Must be a string" })
    readonly changeName: string;

    @ApiProperty({ example: "blue", description: "any tag color" })
    @IsString({ message: "Must be a string" })
    readonly changeColor: string;

}