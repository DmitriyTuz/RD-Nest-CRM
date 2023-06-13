import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class UpdateTagDto {
    @ApiProperty({ example: "Hobby", description: "any tag name" })
    @IsString({ message: "Must be a string" })
    readonly name: string;

    @ApiProperty({ example: "red", description: "any tag color" })
    @IsString({ message: "Must be a string" })
    readonly color: string;

    @ApiProperty({ example: "Education", description: "any tag name" })
    @IsString({ message: "Must be a string" })
    readonly changeName: string;

    @ApiProperty({ example: "blue", description: "any tag color" })
    @IsString({ message: "Must be a string" })
    readonly changeColor: string;

}