import { UsersModule } from './users.module';
import { TestHelper } from '../../test/common/test-helper';
import { UsersService } from './users.service';
import {UsersController} from "./users.controller";
import {AppModule} from "../app.module";
import {AuthService} from "../auth/auth.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {JwtService} from "@nestjs/jwt";
import {AuthModule} from "../auth/auth.module";
import {UserTags} from "../tags/user-tags.model";

describe('UserController', () => {
  let testHelper: TestHelper;
  let usersController: UsersController;
  let userService: UsersService
  let authService: AuthService
  let jwtService: JwtService
  // let userTags: UserTags

  beforeAll(async () => {
    testHelper = new TestHelper(UsersModule, AppModule, AuthModule);
    await testHelper.init();
    usersController = testHelper.app.get<UsersController>(UsersController);
    userService = testHelper.app.get<UsersService>(UsersService);
    authService = testHelper.app.get<AuthService>(AuthService);
    jwtService = testHelper.app.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await testHelper.close();
  });

  it('should be defined', async () => {

    expect(usersController).toBeDefined();
  });

  describe('GetAllUsers', () => {
    it('should return an array of users', async () => {
      const users = await usersController.GetAllUsers();
      expect(users).toBeInstanceOf(Array);
    });
  });

  /**
   * Test the PUT route (add tags to auth user)
   */

  describe('addTagToAuthUserByTwoTagsFields', () => {

    // jest.spyOn(userService, 'addTagsToAuthUserByTwoTagsFields').mockResolvedValue(user);

    it('should return token typeof string', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password'
      }
      const token = await authService.registration(createUserDto);
      console.log('!!! token.token = ', token.token)
      console.log('!!! secret key = ', process.env.PRIVATE_KEY)
      const user = jwtService.verify(token.token, {secret: process.env.PRIVATE_KEY ||  "SECRET"});
      console.log('!!! user = ', user)
      console.log('!!! user.id = ', user.id)

      const tags = [
        { name: 'tag1', color: '#ff0000' },
        { name: 'tag2', color: '#00ff00' },
        { name: 'tag3', color: '#0000ff' },
      ];

      const req = {
        user: { id: user.id },
      };

      await userService.addTagsToAuthUserByTwoTagsFields(tags, user.id)

      let result = await UserTags.findAll({where: {userId: user.id}})
      console.log('!!! result = ', result)

      await userService.deleteUserByEmail('john.doe@example.com')

      expect(result.length).toBe(3);
      expect(typeof(token.token)).toBe('string');
    });
  });

});