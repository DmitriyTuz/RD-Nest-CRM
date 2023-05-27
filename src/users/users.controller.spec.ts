import { Test, TestingModule } from '@nestjs/testing';
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
import sequelizeConfig from '../../config/sequelize.config';
import {User} from "./users.model";
import {UserRepository} from "./users.repository";
import {Transaction} from "sequelize";

import * as request from 'supertest';
import {HttpStatus, Put} from "@nestjs/common";

// import { TransactionWrapperService } from '../helpers/transaction-wrapper.service';

// import { INestApplication } from '@nestjs/common';
// const { wrapPgTransaction } = require('../helpers/transaction-wrapper1.service')

describe('UserController', () => {

  // let app: INestApplication;
  let sequelize: Sequelize;
  // let transaction: any;

  let testHelper: TestHelper;
  let userController: UsersController;
  let userService: UsersService
  let authService: AuthService
  let jwtService: JwtService
  // let userRepository: UserRepository
  // let userTags: UserTags

  // let transactionWrapper: TransactionWrapperService;

  beforeAll(async () => {
    // const moduleTest: TestingModule = await Test.createTestingModule({
    //   imports: [AppModule, UsersModule, AuthModule],
    //   providers: [],
    // }).compile();
    //
    // app = moduleTest.createNestApplication();
    // // transactionWrapper = moduleTest.get<TransactionWrapperService>(TransactionWrapperService);
    // userController = moduleTest.get<UsersController>(UsersController);
    // // userService = moduleTest.get<UsersService>(UsersService);
    // // authService = moduleTest.get<AuthService>(AuthService);
    // // jwtService = moduleTest.get<JwtService>(JwtService);
    // // sequelize = await moduleTest.get<Sequelize>(Sequelize)
    //
    // await app.init();

    // transactionWrapper = testHelper.app.get<TransactionWrapperService>(TransactionWrapperService);

    // testHelper = await new TestHelper(AppModule, UsersModule,  AuthModule);
    testHelper = await new TestHelper(AppModule);
    await testHelper.init();
    userController = await testHelper.app.get<UsersController>(UsersController);
    userService = testHelper.app.get<UsersService>(UsersService);
    authService = testHelper.app.get<AuthService>(AuthService);
    jwtService = testHelper.app.get<JwtService>(JwtService);

    // sequelize = await moduleTest.get<Sequelize>(Sequelize)
    // sequelize = await testHelper.app.get<Sequelize>(Sequelize)
    // transaction = await sequelize.transaction();

    // await testHelper.init();
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

  // afterEach(async () => {
  //   // Отменяем изменения в базе данных после каждого теста
  //   // await transactionWrapper.rollback();
  // });

  // afterEach(async () => {
  //   // Откат изменений в базе данных после каждого теста
  //   await sequelize.transaction(async (transaction) => {
  //     await transaction.rollback();
  //   });
  // });

  // beforeEach(async () => {
  //   // await sequelize.sync({ force: true });
  //   //   sequelize = await testHelper.app.get<Sequelize>(Sequelize)
  //   //   await testHelper.clearDatabase();
  //
  //     // let createUserDto: CreateUserDto = {
  //     //     name: 'John Doe',
  //     //     email: 'john.doe@example.com',
  //     //     password: 'password',
  //     // };
  //     // await userService.createUserWithTransaction(createUserDto, transaction);
  //
  //     // user = await userService.createUser(createUserDto);
  // })
  //
  //   afterEach(async () => {
  //       // console.log('!!! user.id CONTROLLER 2 = ', user.id)
  //       // await userService.deleteUserById(user.id)
  //       // console.log('!!! user.id CONTROLLER 3 = ', user.id)
  //       // await testHelper.clearDatabase();
  //       // await User.truncate({ cascade: true });
  //   });

  beforeEach(async () => {
    await testHelper.clearDatabase();
    // await User.destroy({where: {}});
  })

  // afterEach(async () => {
  //   await testHelper.clearDatabase();
  //   // await User.destroy({where: {}});
  // })

  afterAll(async () => {
    await testHelper.clearDatabase();
    // await User.destroy({where: {}});

    // await sequelize.close();
    await testHelper.close();
    // await transaction.rollback();
    // await testHelper.app.close();
  });

  // it('should be defined', async () => {
  //
  //   expect(userController).toBeDefined();
  // });

  describe('GetAllUsers', () => {
    it('should return an array of users', async () => {
      const users = await userController.GetAllUsers();
      expect(users).toBeInstanceOf(Array);
    });
  });

    describe('GetAllUsers', () => {
      it('should return an array of users', async () => {
        let createUserDto: CreateUserDto = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password',
        };
        await userService.createUser(createUserDto);
        const users = await userController.GetAllUsers();

        expect(users).toBeDefined();
        expect(users.length).toBe(1);
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

  // describe('POST - CreateUserWithTransaction', () => {
  //   it('should return user', async () => {
  //
  //     let createUserDto: CreateUserDto = {
  //       name: 'John Doe',
  //       email: 'john.doe@example.com',
  //       password: 'password',
  //     };
  //
  //     const user = await userController.createUserWithTransaction(createUserDto, '', transaction);
  //
  //     expect(user).toBeDefined();
  //     expect(user.name).toBe(createUserDto.name);
  //     expect(user.email).toBe(createUserDto.email);
  //     expect(user.password).toBe(createUserDto.password);
  //
  //   });
  // });

  // describe('POST - /create-user API with transaction (e2e)', () => {
  //   it('should return status CREATED', async () => {
  //
  //     let createUserDto: CreateUserDto = {
  //       name: 'John Doe',
  //       email: 'john.doe@example.com',
  //       password: 'password',
  //     };
  //
  //     console.log('!!! transaction1.id = ', transaction.id)
  //
  //     const response = await request(testHelper.app.getHttpServer())
  //         .post(`/users/create-user-with-transaction`)
  //         .set('Transaction', JSON.stringify({options: transaction.options}))
  //         .send(createUserDto)
  //
  //     await response.body.name
  //
  //     expect(response.status).toBe(HttpStatus.CREATED);
  //     expect(response.body.name).toBe(createUserDto.name);
  //
  //   });
  // });

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

  // describe('PUT - addTagWithTransaction', () => {
  //   it('should return token typeof string', async () => {
  //     const createTestUserDto: CreateUserDto = {
  //       name: 'John Doe',
  //       email: 'john2.doe@example.com',
  //       password: 'password'
  //     }
  //
  //     const token = await authService.registrationWithTransaction(createTestUserDto, transaction);
  //     const user = jwtService.verify(token.token, {secret: process.env.PRIVATE_KEY ||  "SECRET"});
  //
  //     expect(createTestUserDto.email).toBe(user.email);
  //     expect(typeof(token.token)).toBe('string');
  //
  //     const tags = [
  //       { name: 'tag1', color: '#ff0000' },
  //       { name: 'tag2', color: '#00ff00' },
  //       { name: 'tag3', color: '#0000ff' },
  //     ];
  //
  //     const req = {
  //       user: { id: user.id },
  //     };
  //
  //     await userController.addTagToAuthUserByTwoTagsFieldsWithTransaction(tags, req, transaction);
  //
  //     let result = await UserTags.findAll({where: {userId: user.id}, transaction})
  //     expect(result.length).toBe(3);
  //     expect(typeof(token.token)).toBe('string');
  //
  //     // await transaction.commit()
  //   });
  // });

  // describe('PUT - users/add-tags-by-two-fields API with transaction (e2e)', () => {
  //   it('should return status CREATED', async () => {
  //     const createTestUserDto: CreateUserDto = {
  //       name: 'John Doe',
  //       email: 'john2.doe@example.com',
  //       password: 'password'
  //     }
  //
  //     const token = await authService.registration(createTestUserDto);
  //     // const token = await authService.registrationWithTransaction(createTestUserDto, transaction);
  //     const user = jwtService.verify(token.token, {secret: process.env.PRIVATE_KEY ||  "SECRET"});
  //
  //     const tags = [
  //       { name: 'tag1', color: '#ff0000' },
  //       { name: 'tag2', color: '#00ff00' },
  //       { name: 'tag3', color: '#0000ff' },
  //     ];
  //
  //     // const req = {
  //     //   user: { id: user.id },
  //     // };
  //
  //     // console.log('!!! token = ', token.token)
  //     // console.log('!!! transaction1.id = ', transaction['id'])
  //     // console.log('!!! transaction1.options = ', transaction.options)
  //     // console.log('!!! transaction = ', transaction)
  //
  //     const response = await request(testHelper.app.getHttpServer())
  //         .put(`/users/add-tags-by-array-of-two-fields`)
  //         .set('Authorization', `Bearer ${token.token}`)
  //         // .query({ transaction })
  //         .send(tags)
  //         // .set('Transaction', JSON.stringify({id: transaction.id, options: transaction.options}))
  //
  //     expect(response.status).toBe(HttpStatus.OK);
  //   });
  // });

  // describe('PUT - users/add-tags-by-two-fields API with transaction (e2e)', () => {
  //   it('should return status CREATED', async () => {
  //     const createTestUserDto: CreateUserDto = {
  //       name: 'John Doe',
  //       email: 'john2.doe@example.com',
  //       password: 'password'
  //     }
  //
  //     const token = await authService.registration(createTestUserDto);
  //     const user = jwtService.verify(token.token, {secret: process.env.PRIVATE_KEY ||  "SECRET"});
  //
  //     const tags = [
  //       { name: 'tag1', color: '#ff0000' },
  //       { name: 'tag2', color: '#00ff00' },
  //       { name: 'tag3', color: '#0000ff' },
  //     ];
  //
  //     // const req = {
  //     //   user: { id: user.id },
  //     // };
  //
  //     // console.log('!!! token = ', token.token)
  //     // console.log('!!! transaction1.id = ', transaction['id'])
  //     // console.log('!!! transaction1.options = ', transaction.options)
  //     // console.log('!!! transaction = ', transaction)
  //
  //     const response = await request(testHelper.app.getHttpServer())
  //         .put(`/users/add-tags-by-array-of-two-fields`)
  //         .set('Authorization', `Bearer ${token.token}`)
  //         // .query({ transaction })
  //         .send(tags)
  //         // .set('Transaction', JSON.stringify({id: transaction.id, options: transaction.options}))
  //
  //     expect(response.status).toBe(HttpStatus.OK);
  //   });
  // });

  // describe('PUT - users/add-tags-by-two-fields API with transaction (e2e)', () => {
  //   it('should return status CREATED', async () => {
  //     const createTestUserDto: CreateUserDto = {
  //       name: 'John Doe',
  //       email: 'john2.doe@example.com',
  //       password: 'password'
  //     }
  //
  //     await wrapPgTransaction(async () => {
  //       const token = await authService.registration(createTestUserDto);
  //       // const token = await authService.registrationWithTransaction(createTestUserDto, transaction);
  //       const user = jwtService.verify(token.token, {secret: process.env.PRIVATE_KEY ||  "SECRET"});
  //
  //       const tags = [
  //         { name: 'tag1', color: '#ff0000' },
  //         { name: 'tag2', color: '#00ff00' },
  //         { name: 'tag3', color: '#0000ff' },
  //       ];
  //
  //       const response = await request(app.getHttpServer())
  //           .put(`/users/add-tags-by-array-of-two-fields`)
  //           .set('Authorization', `Bearer ${token.token}`)
  //           // .query({ transaction })
  //           .send(tags)
  //       // .set('Transaction', JSON.stringify({id: transaction.id, options: transaction.options}))
  //
  //       expect(response.status).toBe(HttpStatus.OK);
  //     })
  //   });
  // });

});

