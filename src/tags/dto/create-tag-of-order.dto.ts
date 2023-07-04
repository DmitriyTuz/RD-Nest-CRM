import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class CreateTagOfOrderDto {
    @ApiProperty({example: "Education", description: "interests"})
    @IsString({message: "Must be a string"})
    readonly name: string;

    @ApiProperty({example: "red", description: "color"})
    @IsString({message: "Must be a string"})
    readonly color: string;

    @ApiProperty({example: 1, description: "order id"})
    @IsNumber()
    readonly orderId: number;
}