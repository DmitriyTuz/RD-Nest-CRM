import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class CreateTagDto {
    @ApiProperty({ example: "Education", description: "interests" })
    @IsString({ message: "Must be a string" })
    readonly name: string;

    @ApiProperty({ example: "red", description: "color" })
    @IsString({ message: "Must be a string" })
    readonly color: string;
}