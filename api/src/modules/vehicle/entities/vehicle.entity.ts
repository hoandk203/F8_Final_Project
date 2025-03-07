import {Column, Entity} from "typeorm";
import {Base} from "../../base/base.entity";

@Entity("vehicle")
export class Vehicle extends Base {
    @Column({name: "driver_id", nullable: false})
    driverId: number

    @Column({name: "vehicle_plate_number", nullable: false})
    vehiclePlateNumber: string

    @Column({name: "vehicle_color", nullable: false})
    vehicleColor: string

    @Column({name: "vehicle_image", nullable: false})
    vehicleImage: string

    @Column({name: "vehicle_rc_image", nullable: false})
    vehicleRCImage: string

    @Column({nullable: false})
    status: 'pending' | 'approved' | 'rejected';
}

