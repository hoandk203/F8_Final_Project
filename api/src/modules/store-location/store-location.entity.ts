import {Column, Entity} from "typeorm";
import {Base} from "../base/base.entity";


@Entity("store-location")
export class StoreLocation extends Base{
    @Column("decimal", {precision: 10, scale: 7})
    latitude: number

    @Column("decimal", {precision: 10, scale: 7})
    longitude: number

    @Column({
        name: "store_id"
    })
    storeId: number
}