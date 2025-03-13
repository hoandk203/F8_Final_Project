import {Column, Entity, PrimaryColumn} from "typeorm";


@Entity()
export class Location{
    @PrimaryColumn("decimal", {precision: 10, scale: 7})
    latitude: number

    @PrimaryColumn("decimal", {precision: 10, scale: 7})
    longitude: number

    @Column({
        name: "driver_id"
    })
    driverId: number
}