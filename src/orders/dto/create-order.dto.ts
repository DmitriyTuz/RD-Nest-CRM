import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class CreateOrderDto {
  @ApiProperty({ example: "Order1", description: "user order" })
  @IsString({ message: "Must be a string" })
  readonly name: string;

  @ApiProperty({ example: "any description", description: "order description" })
  @IsString({ message: "Must be a string" })
  readonly description: string;

  @ApiProperty({ example: "1", description: "owner id" })
  @IsNumber()
  readonly userId: number;
}
