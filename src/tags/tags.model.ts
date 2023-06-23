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
    ownerId: number;
}

@Table({ tableName: "tags" })
export class Tag extends Model<Tag, TagCreationAttrs> {

// export class Tag extends Model {
    @ApiProperty({ example: "1", description: "unique id" })
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: "Education", description: "interests" })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @ApiProperty({ example: "#ff0000", description: "tag color" })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    color: string;

    @ApiProperty({ example: "1", description: "field for the id of the tag creator" })
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    ownerId: number;

    @BelongsToMany(() => User, () => UserTags)
    users: User[];
}