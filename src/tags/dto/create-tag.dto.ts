import {ApiProperty} from "@nestjs/swagger";

export class CreateTagDto {
    @ApiProperty({ example: "Education", description: "interests" })
    readonly name: string;
    @ApiProperty({ example: "red", description: "color" })
    readonly color: string;
}