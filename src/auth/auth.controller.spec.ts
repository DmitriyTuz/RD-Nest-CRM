import { TestHelper } from '../../test/common/test-helper';
import {AppModule} from "../app.module";
import {AuthService} from "./auth.service";
import {AuthModule} from "./auth.module";
import {AuthController} from "./auth.controller";
import {UsersModule} from "../users/users.module";
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {User} from "../users/users.model";
import {Sequelize} from "sequelize-typescript";

describe('AuthController', () => {
  let sequelize: Sequelize;
  let transaction: any;

  let testHelper: TestHelper;
  let authController: AuthController
  let authService: AuthService
  let userService: UsersService

  beforeAll(async () => {
    testHelper = new TestHelper(AppModule);
    await testHelper.init();

    authController = testHelper.app.get<AuthController>(AuthController);
    authService = testHelper.app.get<AuthService>(AuthService);
    userService = testHelper.app.get<UsersService>(UsersService);

    sequelize = testHelper.app.get<Sequelize>(Sequelize)
  });

  // beforeEach(async () => {
  //   await testHelper.clearDatabase();
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  //   // await User.destroy({where: {}});
  // })
  //
  // afterEach(async () => {
  //   await testHelper.clearDatabase();
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  // });

  afterAll(async () => {
    // await testHelper.clearDatabase();
    await testHelper.close();
    // await sequelize.close();
  });

  beforeEach(async () => {
    const cls = new Map();
    Object.defineProperty(cls, 'run', {
      value: fn => {
        fn(this);
        return this;
      },
    });
    transaction = await sequelize.transaction();
    sequelize.constructor['_cls'] = cls;
    sequelize.constructor['_cls'].set('transaction', transaction);
  })

  afterEach(async () => {
    await transaction.rollback();
  })

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
        email: 'john5.doe@example.com',
        password: 'password',
      };

      // await User.destroy({ where: {} });

      // await new Promise(resolve => setTimeout(resolve, 3000));

      const mockUser = await userService.createUser(createUserDto);

      // await new Promise(resolve => setTimeout(resolve, 2000));

      const req = {
        user: { id: mockUser.id },
      };

      jest.spyOn(authService, 'getCurrentUser').mockResolvedValueOnce(mockUser);

      const result = await authController.getCurrentUser(req);

      // await userService.deleteUserByEmail('john.doe@example.com')

      expect(result).toEqual(mockUser);
    });
  });
});