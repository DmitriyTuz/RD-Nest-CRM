import {ApiProperty} from "@nestjs/swagger";

export class AddTagDto {
    @ApiProperty({ example: "Hobby", description: "any tag name" })
    readonly name: string;
    @ApiProperty({ example: "red", description: "any tag color" })
    readonly color: string;
}