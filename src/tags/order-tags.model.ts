import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import {Tag} from "./tags.model";
import {Order} from "../orders/orders.model";

@Table({ tableName: "order_tags", createdAt: false, updatedAt: false })
export class OrderTags extends Model<OrderTags> {
    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true,
        allowNull: false
    })
    id: number;

    @ForeignKey(() => Tag)
    @Column({ type: DataType.INTEGER })
    tagId: number;

    @ForeignKey(() => Order)
    @Column({ type: DataType.INTEGER })
    userId: number;

}