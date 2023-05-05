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

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './users.model';
import {SequelizeModule} from "@nestjs/sequelize";
import {Tag} from "../tags/tags.model";
import {UserTags} from "../tags/user-tags.model";
import {AppModule} from "../app.module";
import {TagsModule} from "../tags/tags.module";
import {forwardRef} from "@nestjs/common";
import {AuthModule} from "../auth/auth.module";
import {UserRepository} from "./users.repository";
import {ConfigModule} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {TagRepository} from "../tags/tags.repository";
import {TagsService} from "../tags/tags.service";

describe('UsersService', () => {
    let service: UsersService;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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
                // TagsModule
                // forwardRef(() => AuthModule)
            ]
        }).compile();

        service = module.get<UsersService>(UsersService);
        userRepository = module.get<UserRepository>(UserRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('GetAllUsers', () => {
        it('should return an array of users', async () => {
            const result: User[] = [
                await userRepository.createUser({name: "Sasha", email: "s@gmail.com", password: "123"}),
                await userRepository.createUser({name: "Gena", email: "g@gmail.com", password: "123"})
            ]
            await userRepository.deleteUserByEmail("s@gmail.com")
            await userRepository.deleteUserByEmail("g@gmail.com")

            jest.spyOn(service['userRepository'], 'findAll').mockResolvedValue(result);

            expect(await service.GetAllUsers()).toBe(result);
            expect((await service.GetAllUsers()).length).toBe(2);
            expect(typeof(await service.GetAllUsers())).toEqual("object")
        });
    });
});
