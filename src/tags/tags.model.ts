import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.model";
import {UserTags} from "./user-tags.model";

interface TagCreationAttrs {
    name: string
    color: string;
    tagCreatorId: number;
}

@Table({ tableName: "tags" })
export class Tag extends Model<Tag, TagCreationAttrs> {

    @ApiProperty({ example: "1", description: "unique id" })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: "Education", description: "interests" })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    name: string;

    @ApiProperty({ example: "red", description: "color: green - junior, blue - medium, red - pro" })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    color: string;

    @ApiProperty({ example: "1", description: "field for the id of the tag creator" })
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    tagCreatorId: number;

    @BelongsToMany(() => User, () => UserTags)
    users: User[];
}