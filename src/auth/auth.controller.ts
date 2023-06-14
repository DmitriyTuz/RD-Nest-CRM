import {Body, Controller, Get, Post, Request, UseGuards, UsePipes} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {ValidationPipe} from "../validation.pipe";
import {AuthGuard} from "@nestjs/passport";

@ApiTags("Authorization")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @UsePipes(ValidationPipe)
  @Post("/registration")
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/get-current-user")
  getCurrentUser(@Request() req) {
    return this.authService.getCurrentUser(req);
  }

}
