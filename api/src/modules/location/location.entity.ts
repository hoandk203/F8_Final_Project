import {Column, Entity} from "typeorm";
import {Base} from "../base/base.entity";


@Entity()
export class Location extends Base{
    @Column("decimal", {precision: 10, scale: 7})
    latitude: number

    @Column("decimal", {precision: 10, scale: 7})
    longitude: number

    @Column({
        name: "driver_id"
    })
    driverId: number
}