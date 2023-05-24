import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import sequelize, {Transaction} from "sequelize";
import {UsersService} from "../users/users.service";
import {Sequelize} from "sequelize-typescript";
import sequelizeConfig from "../../config/sequelize.config";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,
              private userService: UsersService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const authHeader = request.headers.authorization;
      const bearer = authHeader.split(" ")[0];
      const token = authHeader.split(" ")[1];

      if (bearer !== "Bearer" || !token) {
        throw new UnauthorizedException({ message: "User is not authorized" });
      }

      const user = this.jwtService.verify(token, { secret: process.env.PRIVATE_KEY });

      // const { id, options } = JSON.parse(request.headers['transaction']);
      // const { options } = JSON.parse(request.header('Transaction'));
      // console.log('!!! options = ', options);
      // console.log('!!! id = ', id);
      // let sequelize = new Sequelize(sequelizeConfig)
      // const transaction = sequelize.transaction(options)
      //     console.log('!!! HeaderTransaction = ', transaction);

      // if (request.header('transaction')) { request.transaction = request.header('transaction')}

      // request.transaction = transaction;
      request.user = user;

      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException({ message: "User is not authorized" });
    }
  }
}
