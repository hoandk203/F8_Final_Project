import {Column, Entity} from "typeorm";
import {User} from "../base/user.entity";


@Entity()
export class Store extends User{
    @Column({name: "vendor_id", nullable: true})
    vendorId: number
}