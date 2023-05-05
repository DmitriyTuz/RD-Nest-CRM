// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller';
//
// describe('UsersController', () => {
//   let controller: UsersController;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//     }).compile();
//
//     controller = module.get<UsersController>(UsersController);
//   });
//
//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });

//------------------------------------------------------------------

// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
// import * as request from 'supertest';
// import { HttpStatus, INestApplication } from '@nestjs/common';
// import { AppModule } from '../app.module';
// import {User} from "./users.model";
//
// describe('UsersController', () => {
//   let app: INestApplication;
//   let usersService: UsersService;
//
//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();
//
//     app = moduleFixture.createNestApplication();
//     await app.init();
//
//     usersService = moduleFixture.get<UsersService>(UsersService);
//   });
//
//   afterAll(async () => {
//     await app.close();
//   });
//
//   describe('getAllUsers', () => {
//     it('should return all users', async () => {
//       const users: User[] = [
//         {
//           id: 1,
//           name: 'John',
//           email: 'john@example.com',
//           password: 'password',
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         {
//           id: 2,
//           name: 'Jane',
//           email: 'jane@example.com',
//           password: 'password',
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         }
//       ];
//
//       jest.spyOn(usersService, 'getAllUsers').mockResolvedValue(users);
//
//       const response = await request(app.getHttpServer()).get('/users/get-all-users');
//
//       expect(response.status).toBe(HttpStatus.OK);
//       expect(response.body).toEqual(users);
//     });
//   });
// });

//------------------------------------------------------------------

// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller';
// import { UsersService } from './users.service';
// import { User } from './users.model';
// import { sequelize } from '../../test/setupTest';
// import {AppModule} from "../app.module";
// import {SequelizeModule} from "@nestjs/sequelize";
// import {Tag} from "../tags/tags.model";
// import {UserTags} from "../tags/user-tags.model";
// import {TagsModule} from "../tags/tags.module";
// import {forwardRef} from "@nestjs/common";
// import {AuthModule} from "../auth/auth.module";
//
// describe('UsersController', () => {
//   let controller: UsersController;
//   let service: UsersService;
//
//   beforeAll(async () => {
//     console.log(console.log('!!! process.env.NODE_ENV 2 = ', process.env.NODE_ENV));
//     console.log('!!! sequelize = ', sequelize)
//     await sequelize.authenticate();
//   });
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//       providers: [
//         UsersService,
//         { provide: 'UserModel', useValue: User },
//       ],
//       imports: [
//         SequelizeModule.forFeature([User, Tag, UserTags]),
//         TagsModule,
//         forwardRef(() => AuthModule),
//         AppModule
//       ]
//     }).compile();
//
//     controller = module.get<UsersController>(UsersController);
//     service = module.get<UsersService>(UsersService);
//   });
//
//   afterAll(async () => {
//     await sequelize.close();
//   });
//
//   it('should return all users', async () => {
//     const users: User[] = await service.getAllUsers();
//     const result = await controller.getAllUsers();
//     expect(result).toEqual(users);
//   });
// });
//------------------------------------------------------------------
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.model';
import {SequelizeModule} from "@nestjs/sequelize";
import {Tag} from "../tags/tags.model";
import {UserTags} from "../tags/user-tags.model";
import {UserRepository} from "./users.repository";
import {ConfigModule} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";

import * as request from 'supertest';
import {HttpStatus, INestApplication} from "@nestjs/common";
import {TestHelper} from "../../test/common/test-helper";
import {TagsModule} from "../tags/tags.module";
import {TagRepository} from "../tags/tags.repository";
import {TagsService} from "../tags/tags.service";


describe('UserController', () => {
  let controller: UsersController;
  let service: UsersService;
  let userRepository: UserRepository;
  let app: INestApplication;
  // let testHelper: TestHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, UserRepository, TagsService, TagRepository],
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: +process.env.POSTGRES_PORT,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          models: [User, Tag, UserTags],
          autoLoadModels: true
        }),
        SequelizeModule.forFeature([User, Tag, UserTags]),
        JwtModule,
        // TagsModule,
        // forwardRef(() => AuthModule)
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);

    app = module.createNestApplication();
    await app.init();

    // testHelper = new TestHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  // });

  it('should be defined', async () => {

    const response = await request(app.getHttpServer()).get('/users/get-all-users');

    expect(controller).toBeDefined();
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toBeDefined()
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))

  });

  // describe('findAll', () => {
  it('should return an array of users', async () => {
    const result: User[] = [
      await userRepository.createUser({name: "Sasha", email: "s@gmail.com", password: "123"}),
      await userRepository.createUser({name: "Gena", email: "g@gmail.com", password: "123"})
    ]
      await userRepository.deleteUserByEmail("s@gmail.com")
      await userRepository.deleteUserByEmail("g@gmail.com")

      jest.spyOn(controller, 'GetAllUsers').mockResolvedValue(result);
      // jest.spyOn(testHelper, 'findAll').mockResolvedValue(result);

      expect(await controller.GetAllUsers()).toBe(result);
    });

  it('should NOT GET all the users', async() => {
    const response = await request(app.getHttpServer()).get('/users/get-all-user');
    expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
  })

  // it('addTagToUser', async() => {
  //
  //   let Payload;
  //   const response = await request(app.getHttpServer()).put('/users/add-tag').send(Payload);
  // })
});


// });