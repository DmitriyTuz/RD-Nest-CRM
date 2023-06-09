import { TestHelper } from '../../test/common/test-helper';
import {AppModule} from "../app.module";
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";
import { Sequelize} from 'sequelize-typescript';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {TagDto} from "../users/dto/add-tag.dto";
import {TagsService} from "./tags.service";
import {Tag} from "./tags.model";

describe('TagController', () => {

  let sequelize: Sequelize;
  let transaction: any;
  let testHelper: TestHelper;
  let tagService: TagsService;
  let authService: AuthService
  let jwtService: JwtService

  beforeAll(async () => {

//-----------------------------------------------------------------

    testHelper = new TestHelper(AppModule);
    await testHelper.init();
    tagService = testHelper.app.get<TagsService>(TagsService);
    authService = testHelper.app.get<AuthService>(AuthService);
    jwtService = testHelper.app.get<JwtService>(JwtService);

    sequelize = testHelper.app.get<Sequelize>(Sequelize)
  });

  afterAll(async () => {
    await testHelper.close();
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

    /**
     * Test the POST (create tag by authorized user)
     */

  describe('POST - createUserTag', () => {
    it('should return a tag', async () => {
      const createTestUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password'
      }

      const token = await authService.registration(createTestUserDto);
      const user = jwtService.verify(token.token, {secret: process.env.PRIVATE_KEY ||  "SECRET"});

      const req = {
        user: { id: user.id },
      };

      const createTestTagDto: TagDto = {
        name: 'tag1',
        color: '#ff0000',
      }

      const tag = await tagService.createUserTag(createTestTagDto, req.user.id)

      expect(tag.name).toBe('tag1');
      expect(tag.color).toBe('#ff0000');
      expect(tag.ownerId).toBe(user.id);
    });
  });

  /**
   * Test the DELETE (deleting a tag associated with an authorized user profile)
   */

  describe('DELETE - deleteUserTag', () => {
    it('should return null', async () => {
      const createTestUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password'
      }

      const token = await authService.registration(createTestUserDto);
      const user = jwtService.verify(token.token, {secret: process.env.PRIVATE_KEY ||  "SECRET"});

      const tags = [
        { name: 'tag1', color: '#ff0000' },
        { name: 'tag2', color: '#00ff00' }
      ];

      const arrayForBulkCreate = tags.map((tag) => ({ ...tag, ownerId: user.id }));
      await tagService.bulkCreateTags(arrayForBulkCreate);

      const req = {
        user: { id: user.id },
      };

      const deleteTestTagDto = { name: 'tag1', color: '#ff0000', ownerId: user.id }

      await tagService.deleteUserTag(deleteTestTagDto, req.user.id)

      const tagsResult = await Tag.findOne({where: { name: 'tag1', color: '#ff0000', ownerId: user.id }})

      expect(tagsResult).toBe(null);
    });
  });
});