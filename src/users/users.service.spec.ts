// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';
//
// describe('UsersService', () => {
//   let service: UsersService;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [UsersService],
//     }).compile();
//
//     service = module.get<UsersService>(UsersService);
//   });
//
//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

//-------------------------------------------------------------------

// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import { User } from './users.model';
// import {SequelizeModule} from "@nestjs/sequelize";
// import {Tag} from "../tags/tags.model";
// import {UserTags} from "../tags/user-tags.model";
// import {AppModule} from "../app.module";
// import {TagsModule} from "../tags/tags.module";
// import {forwardRef} from "@nestjs/common";
// import {AuthModule} from "../auth/auth.module";
// import {UserRepository} from "./users.repository";
// import {ConfigModule} from "@nestjs/config";
// import {JwtModule, JwtService} from "@nestjs/jwt";
// import {TagRepository} from "../tags/tags.repository";
// import {TagsService} from "../tags/tags.service";
// import {UsersModule} from "./users.module";
//
// describe('UsersService', () => {
//     let service: UsersService;
//     let userRepository: UserRepository;
//
//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [UsersService, UserRepository, TagRepository, TagsService, JwtService],
//             imports: [
//                 AppModule,
//                 UsersModule
//                 // JwtModule,
//                 // TagsModule
//                 // forwardRef(() => AuthModule)
//             ]
//         }).compile();
//
//         service = module.get<UsersService>(UsersService);
//         userRepository = module.get<UserRepository>(UserRepository);
//     });
//
//     it('should be defined', () => {
//         expect(service).toBeDefined();
//     });
//
//     describe('GetAllUsers', () => {
//         it('should return an array of users', async () => {
//             const result: User[] = [
//                 await userRepository.createUser({name: "Sasha", email: "s@gmail.com", password: "123"}),
//                 await userRepository.createUser({name: "Gena", email: "g@gmail.com", password: "123"})
//             ]
//             await userRepository.deleteUserByEmail("s@gmail.com")
//             await userRepository.deleteUserByEmail("g@gmail.com")
//
//             jest.spyOn(service['userRepository'], 'findAll').mockResolvedValue(result);
//
//             expect(await service.GetAllUsers()).toBe(result);
//             expect((await service.GetAllUsers()).length).toBe(2);
//             expect(typeof(await service.GetAllUsers())).toEqual("object")
//         });
//     });
// });

//-------------------------------------------------------------------

import { UsersModule } from './users.module';
import { SequelizeTestHelper } from '../../test/common/sequelize-test-helper';
import { User } from './users.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {AppModule} from "../app.module";

describe('UserService', () => {
    let sequelizeHelper: SequelizeTestHelper;
    let userService: UsersService;

    beforeAll(async () => {
        sequelizeHelper = new SequelizeTestHelper(UsersModule, AppModule);
        await sequelizeHelper.init();
        userService = sequelizeHelper.app.get<UsersService>(UsersService);
    });

    afterAll(async () => {
        await sequelizeHelper.close();
    });

    describe('GetAllUsers', () => {
        it('should return an array of users', async () => {
            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password',
            };
            await userService.createUser(createUserDto);
            const users = await userService.GetAllUsers();
            await userService.deleteUserByEmail('john.doe@example.com')

            expect(users).toHaveLength(1);
            expect(users[0]).toBeInstanceOf(User);
            expect(users[0].name).toEqual(createUserDto.name);
            expect(users[0].email).toEqual(createUserDto.email);
        });
    });
});