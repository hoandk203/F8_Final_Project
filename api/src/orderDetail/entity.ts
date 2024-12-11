import {Column, Entity} from "typeorm";
import {Base} from "../base/base.entity";


@Entity()
export class OrderDetail extends Base{
    @Column({
        name: "order_id",
    })
    orderId: number

    @Column({
        name: "material_id",
    })
    materialId: number

    @Column({
        name: "weight",
    })
    weight: number

    @Column({
        name: "amount",
        type: "numeric",
        precision: 10,
        scale: 2
    })
    amount: number
}