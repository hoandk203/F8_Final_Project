import {Column, Entity} from "typeorm";
import {Base} from "../base/base.entity";


@Entity()
export class Order extends Base{
    @Column({
        name: "driver_id",
        nullable: true
    })
    driverId: number

    @Column({
        name: "store_id",
        nullable: true
    })
    storeId: number

    @Column({
        name: "amount",
        nullable: true,
        type: "numeric"
    })
    amount: number

    @Column({
        name: "status",
        default: "pending"
    })
    status: "pending" | "accepted" | "on moving" | "completed" | "canceled"

    @Column({
        name: "scrap_image_url",
    })
    scrapImageUrl: string

    @Column({
        name: "proof_image_url",
        nullable: true
    })
    proofImageUrl: string

    @Column({
        name: "declined_driver_id",
        type: "integer",
        array: true,
        nullable: true,
        default: []
    })
    declinedDriverId: number[]

    @Column({
        name: "canceled_driver_id",
        type: "integer",
        array: true,
        nullable: true,
        default: []
    })
    canceledDriverId: number[]

    @Column({
        name: "staff_id",
        nullable: true
    })
    staffId: number
}