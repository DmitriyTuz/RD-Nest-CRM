import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Tag} from "../tags/tags.model";
import {UserTags} from "../tags/user-tags.model";

interface UserCreationAttrs {
    name: string
    email: string;
    password: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttrs> {

    @ApiProperty({ example: "1", description: "unique id" })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
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
}