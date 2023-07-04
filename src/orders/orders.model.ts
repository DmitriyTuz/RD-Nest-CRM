import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { User } from "../users/users.model";
import {Tag} from "../tags/tags.model";
import {OrderTags} from "../tags/order-tags.model";

interface OrderCreationAttrs {
    name: string;
    description: string;
    userId: number;
}

@Table({ tableName: "orders" })
export class Order extends Model<Order, OrderCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @BelongsTo(() => User)
    owner: User;

    @BelongsToMany(() => Tag, () => OrderTags)
    tags: Tag[];
}
