import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "Alex", description: "name" })
  readonly name: string;
  @ApiProperty({ example: "user@gmail.com", description: "email" })
  readonly email: string;
  @ApiProperty({ example: "1234567", description: "password" })
  readonly password: string;
}
