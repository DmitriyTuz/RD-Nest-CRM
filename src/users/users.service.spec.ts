import { UsersModule } from './users.module';
import { TestHelper } from '../../test/common/test-helper';
import { User } from './users.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {AppModule} from "../app.module";
import {AuthModule} from "../auth/auth.module";
import {Sequelize} from "sequelize-typescript";
import {UserRepository} from "./users.repository";
import {UserTags} from "../tags/user-tags.model";
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";

describe('UserService', () => {

  let sequelize: Sequelize;
  let transaction: any;

  let testHelper: TestHelper;
  let userService: UsersService;
  let authService: AuthService
  let jwtService: JwtService

  beforeAll(async () => {
    testHelper = new TestHelper(AppModule);
    await testHelper.init();
    userService = testHelper.app.get<UsersService>(UsersService);
    authService = testHelper.app.get<AuthService>(AuthService);
    jwtService = testHelper.app.get<JwtService>(JwtService);

    // sequelize = await testHelper.app.get<Sequelize>(Sequelize)
    // transaction = await sequelize.transaction();

    // sequelize = new Sequelize(sequelizeConfig);
    // await sequelize.authenticate();
  });

//--------------------------------------------------------------
    // !!! use for transactions

    // beforeEach(async () => {
    //     // sequelize = await testHelper.app.get<Sequelize>(Sequelize)
    //     transaction = await sequelize.transaction();
    // });
    //
    // afterEach(async () => {
    //   await transaction.rollback();
    //   // await testHelper.clearDatabase();
    // });
//--------------------------------------------------------------

  beforeEach(async () => {
    await testHelper.clearDatabase();
    // await User.destroy({where: {}});
  })

  // afterEach(async () => {
  //   await testHelper.clearDatabase();
  // });

  afterAll(async () => {
    await testHelper.clearDatabase();
    // await User.destroy({where: {}});
    // await sequelize.close();
    await testHelper.close();
  });

  describe('GetAllUsers', () => {
    it('should return an array of users', async () => {
      let createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john3.doe@example.com',
        password: 'password',
      };

      await userService.createUser(createUserDto);
      const users = await userService.GetAllUsers();

      expect(users).toHaveLength(1);
      expect(users[0]).toBeInstanceOf(User);
      expect(users[0].name).toEqual(createUserDto.name);
      expect(users[0].email).toEqual(createUserDto.email);

    });
  });

  describe('GET - GetAllUsers', () => {
    it('should return an array of users', async () => {
      const users = await userService.GetAllUsers();
      expect(users).toBeInstanceOf(Array);
    });
  });

  // describe('PUT - addTagsToAuthUserByTwoTagsFields', () => {
  //   it('should return token typeof string', async () => {
  //     const createTestUserDto: CreateUserDto = {
  //       name: 'John Doe',
  //       email: 'john4.doe@example.com',
  //       password: 'password'
  //     }
  //
  //     const token = await authService.registration(createTestUserDto);
  //     const user = jwtService.verify(token.token, {secret: process.env.PRIVATE_KEY ||  "SECRET"});
  //
  //     expect(createTestUserDto.email).toBe(user.email);
  //     expect(typeof(token.token)).toBe('string');
  //
  //     const tags = [
  //       { name: 'tag4', color: '#ff0000' },
  //       { name: 'tag5', color: '#00ff00' },
  //       { name: 'tag6', color: '#0000ff' },
  //     ];
  //
  //     const req = {
  //       user: { id: user.id },
  //     };
  //
  //     console.log('!!! req.user.id = ', req.user.id)
  //     await userService.addTagsToAuthUserByTwoTagsFields(tags, req.user.id);
  //
  //     let result = await UserTags.findAll({where: {userId: user.id}, transaction})
  //     expect(result.length).toBe(3);
  //     expect(typeof(token.token)).toBe('string');
  //
  //     // await transaction.commit()
  //   });
  // });

  // describe('POST - CreateUserWithTransaction', () => {
  //   it('should return user', async () => {
  //
  //     let createUserDto: CreateUserDto = {
  //       name: 'John Doe',
  //       email: 'john.doe@example.com',
  //       password: 'password',
  //     };
  //
  //     const user = await userService.createUserWithTransaction(createUserDto, transaction);
  //
  //     expect(user).toBeDefined();
  //     expect(user.name).toBe(createUserDto.name);
  //     expect(user.email).toBe(createUserDto.email);
  //     expect(user.password).toBe(createUserDto.password);
  //
  //   });
  // });
  //
  //   describe('PUT - addTagWithTransaction', () => {
  //       it('should return token typeof string', async () => {
  //           const createTestUserDto: CreateUserDto = {
  //               name: 'John Doe',
  //               email: 'john2.doe@example.com',
  //               password: 'password'
  //           }
  //
  //           const token = await authService.registrationWithTransaction(createTestUserDto, transaction);
  //           const user = jwtService.verify(token.token, {secret: process.env.PRIVATE_KEY ||  "SECRET"});
  //
  //           expect(createTestUserDto.email).toBe(user.email);
  //           expect(typeof(token.token)).toBe('string');
  //
  //           const tags = [
  //               { name: 'tag1', color: '#ff0000' },
  //               { name: 'tag2', color: '#00ff00' },
  //               { name: 'tag3', color: '#0000ff' },
  //           ];
  //
  //           const req = {
  //               user: { id: user.id },
  //           };
  //
  //           await userService.addTagsWithTransaction(tags, req.user.id, transaction);
  //
  //           let result = await UserTags.findAll({where: {userId: user.id}, transaction})
  //           expect(result.length).toBe(3);
  //           expect(typeof(token.token)).toBe('string');
  //
  //           // await transaction.commit()
  //       });
  //   });


  // describe('GetAllUsersWithTransaction', () => {
  //   it('should return an array of users', async () => {
  //     let createUserDto: CreateUserDto = {
  //       name: 'John Doe',
  //       email: 'john.doe@example.com',
  //       password: 'password',
  //     };
  //     await userService.createUserWithTransaction(createUserDto, transaction);
  //     const users = await userService.GetAllUsersWithTransaction(transaction);
  //
  //     expect(users).toBeDefined();
  //     // expect(users.length).toBe(1);
  //     expect(users).toHaveLength(1);
  //     expect(users[0]).toBeInstanceOf(User);
  //     expect(users).toBeInstanceOf(Array);
  //     expect(users[0].name).toEqual(createUserDto.name);
  //     // expect(users[0].email).toEqual(createUserDto.email);
  //   });
  // });
});