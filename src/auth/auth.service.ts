import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcryptjs";
import { User } from "../users/users.model";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(userDto: CreateUserDto) {
    try {
      const user = await this.validateUser(userDto);
      return this.generateToken(user);
    } catch (e) {
      throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async registration(userDto: CreateUserDto) {
    try {
      const candidate = await this.userService.getUserByEmail(userDto.email);
      if (candidate) {
        throw new HttpException(
            "user with this email already exists",
            HttpStatus.BAD_REQUEST
        );
      }
      const hashPassword = await bcrypt.hash(userDto.password, 5);
      const user = await this.userService.createUser({
        ...userDto,
        password: hashPassword,
      });
      return this.generateToken(user);
    } catch (e) {
      throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getCurrentUser(req) {
    return await this.userService.getUserById(req.user.id)
  }

  private async generateToken(user: User) {
    const payload = { name: user.name, email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload, {
        secret: process.env.PRIVATE_KEY || "SECRET",
        expiresIn: "24h"
      }),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password
    );
    if (user && passwordEquals) {

      return user;
    }
    throw new UnauthorizedException({
      message: "Incorrect email address or password",
    });
  }

  validateUserByEmail(email: string): Promise<User | null> {
    return this.userService.getUserByEmail(email);
  }
}
