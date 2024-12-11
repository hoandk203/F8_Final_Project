import {Column, Entity, PrimaryColumn} from "typeorm";


@Entity()
export class Location{
    @PrimaryColumn("numeric", {precision: 3, scale: 10} )
    latitude: number

    @PrimaryColumn("numeric", {precision: 3, scale: 10} )
    longitude: number

    @Column({
        name: "driver_id"
    })
    driverId: number
}