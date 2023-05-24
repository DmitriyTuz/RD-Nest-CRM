import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import {User} from "../users/users.model";
import {Tag} from "./tags.model";

@Table({ tableName: "user_tags", createdAt: false, updatedAt: false })
export class UserTags extends Model<UserTags> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => Tag)
    @Column({ type: DataType.INTEGER })
    tagId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

}