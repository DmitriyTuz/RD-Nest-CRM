import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "Alex", description: "name" })
  @IsString({ message: "Must be a string" })
  readonly name: string;

  @ApiProperty({ example: "user@gmail.com", description: "email" })
  @IsString({ message: "Must be a string" })
  @IsEmail({}, { message: "Incorrect email" })
  readonly email: string;

  @ApiProperty({ example: "1234567", description: "password" })
  @IsString({ message: "Must be a string" })
  @Length(4, 16, { message: "Must be between 4 and 16" })
  readonly password: string;
}
