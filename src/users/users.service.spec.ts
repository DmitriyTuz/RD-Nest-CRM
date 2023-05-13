import { UsersModule } from './users.module';
import { TestHelper } from '../../test/common/test-helper';
import { User } from './users.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {AppModule} from "../app.module";
import {AuthModule} from "../auth/auth.module";

describe('UserService', () => {
    let testHelper: TestHelper;
    let userService: UsersService;

    beforeAll(async () => {
        testHelper = new TestHelper(UsersModule, AppModule, AuthModule);
        await testHelper.init();
        userService = testHelper.app.get<UsersService>(UsersService);
    });

    afterAll(async () => {
        await testHelper.close();
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