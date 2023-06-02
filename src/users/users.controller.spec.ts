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

import { Sequelize, Model } from 'sequelize-typescript';
import {User} from "./users.model";


import * as request from 'supertest';
import {HttpStatus, Put} from "@nestjs/common";

describe('UserController', () => {

  let sequelize: Sequelize;
  let transaction: any;

  let testHelper: TestHelper;
  let userController: UsersController;
  let userService: UsersService
  let authService: AuthService
  let jwtService: JwtService
  // let userRepository: UserRepository
  // let userTags: UserTags

  beforeAll(async () => {

//-----------------------------------------------------------------

    testHelper = new TestHelper(AppModule);
    await testHelper.init();
    userController = testHelper.app.get<UsersController>(UsersController);
    userService = testHelper.app.get<UsersService>(UsersService);
    authService = testHelper.app.get<AuthService>(AuthService);
    jwtService = testHelper.app.get<JwtService>(JwtService);

    sequelize = testHelper.app.get<Sequelize>(Sequelize)
  });

//--------------------------------------------------------------
    // !!! use for transactions

    // beforeEach(async () => {
    //     // sequelize = await testHelper.app.get<Sequelize>(Sequelize)
    //     transaction = await sequelize.transaction();
    // });

    // afterEach(async () => {
    //     await transaction.rollback();
    // });

//--------------------------------------------------------------

  // beforeEach(async () => {
  //   await testHelper.clearDatabase();
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  //   // await User.destroy({where: {}});
  // })
  //
  // afterEach(async () => {
  //   await testHelper.clearDatabase();
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  //   // await User.destroy({where: {}});
  // })

//------------------------------------------------------------

  afterAll(async () => {
    // await testHelper.clearDatabase();
    // await User.destroy({where: {}});

    // await sequelize.close();
    await testHelper.close();
    // await sequelize.close();
    // await transaction.rollback();
    // await testHelper.app.close();
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

    expect(userController).toBeDefined();
  });

  describe('GetAllUsers', () => {
    it('should return an array of users', async () => {
      const users = await userController.GetAllUsers();
      expect(users).toBeInstanceOf(Array);
    });
  });

  describe('GetAllUsers1', () => {
    it('should return an array of users', async () => {
      let createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
      };

      await userController.createUser(createUserDto);
      const users = await userController.GetAllUsers();

      expect(users).toBeDefined();
      expect(users).toHaveLength(1);
      expect(users[0]).toBeInstanceOf(User);
      expect(users[0].name).toEqual(createUserDto.name);
      expect(users[0].email).toEqual(createUserDto.email);
    });
  });

  describe('POST - CreateUser', () => {
    it('should return user', async () => {

      let createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john1.doe@example.com',
        password: 'password',
      };

      const user = await userController.createUser(createUserDto);

      expect(user).toBeDefined();
      expect(user.name).toBe(createUserDto.name);
      expect(user.email).toBe(createUserDto.email);
      expect(user.password).toBe(createUserDto.password);

    });
  });

  /**
   * Test the PUT route (add tags to auth user)
   */

  describe('PUT /users/add-tags-by-two-fields API (e2e)', () => {
    it('should return token typeof string', async () => {
      const createTestUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john2.doe@example.com',
        password: 'password'
      }

      const token = await authService.registration(createTestUserDto);
      // const token = await authService.registration(createTestUserDto);
      const user = jwtService.verify(token.token, {secret: process.env.PRIVATE_KEY ||  "SECRET"});

      expect(createTestUserDto.email).toBe(user.email);
      expect(typeof(token.token)).toBe('string');

      const tags = [
        { name: 'tag1', color: '#ff0000' },
        { name: 'tag2', color: '#00ff00' },
        { name: 'tag3', color: '#0000ff' },
      ];

      const req = {
        user: { id: user.id },
      };

      const response = await request(testHelper.app.getHttpServer())
          .put(`/users/add-tags-by-two-fields`)
          .set('Authorization', `Bearer ${token.token}`)
          .send(tags)

      // console.log('!!! response = ', response.status);
      // console.log('!!! token = ', token.token);

      // await userService.addTagsToAuthUserByTwoTagsFields(tags, req.user.id)
      let result = await UserTags.findAll({where: {userId: user.id}})

      expect(result.length).toBe(3);
      expect(typeof(token.token)).toBe('string');

      expect(response.status).toBe(HttpStatus.OK);
    });
  });

});

