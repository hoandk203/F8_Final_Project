import {Column, Entity, PrimaryColumn} from "typeorm";


@Entity("store-location")
export class StoreLocation{
    @PrimaryColumn("decimal", {precision: 10, scale: 7})
    latitude: number

    @PrimaryColumn("decimal", {precision: 10, scale: 7})
    longitude: number

    @Column({
        name: "store_id"
    })
    storeId: number
}