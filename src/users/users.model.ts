import {
    BelongsToMany,
    Column,
    DataType, HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Tag} from "../tags/tags.model";
import {UserTags} from "../tags/user-tags.model";
import {Post} from "../posts/posts.model";
import {Order} from "../orders/orders.model";

interface UserCreationAttrs {
    name: string
    email: string;
    password: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttrs> {

// export class User extends Model {
    @ApiProperty({ example: "1", description: "unique id" })
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @ApiProperty({ example: "Alex", description: "name" })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @ApiProperty({ example: "user@gmail.com", description: "email" })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    email: string;

    @ApiProperty({ example: "1234567", description: "password" })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password: string;

    @BelongsToMany(() => Tag, () => UserTags)
    tags: Tag[];

    @HasMany(() => Post)
    posts: Post[];

    @HasMany(() => Order)
    orders: Order[];
}

