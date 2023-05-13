import { TestHelper } from '../../test/common/test-helper';
import {AppModule} from "../app.module";
import {AuthService} from "./auth.service";
import {AuthModule} from "./auth.module";
import {AuthController} from "./auth.controller";
import {UsersModule} from "../users/users.module";
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/create-user.dto";

describe('AuthController', () => {
  let testHelper: TestHelper;
  let authController: AuthController
  let authService: AuthService
  let userService: UsersService

  beforeAll(async () => {
    testHelper = new TestHelper(UsersModule, AppModule, AuthModule);
    await testHelper.init();

    authController = testHelper.app.get<AuthController>(AuthController);
    authService = testHelper.app.get<AuthService>(AuthService);
    userService = testHelper.app.get<UsersService>(UsersService);

  });

  afterAll(async () => {
    await testHelper.close();
  });

  it('should be defined', async () => {

    expect(authController).toBeDefined();
  });

  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      // const mockUser = {
      //   id: 1,
      //   username: 'testuser',
      //   email: 'testuser@example.com',
      // };

      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
      };

      const mockUser = await userService.createUser(createUserDto);

      const req = {
        user: { id: mockUser.id },
      };

      await userService.deleteUserByEmail('john.doe@example.com')

      jest.spyOn(authService, 'getCurrentUser').mockResolvedValueOnce(mockUser);

      const result = await authController.getCurrentUser(req);

      expect(result).toEqual(mockUser);
    });
  });
});