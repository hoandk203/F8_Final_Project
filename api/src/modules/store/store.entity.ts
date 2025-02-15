import {Column, Entity} from "typeorm";
import {Info} from "../base/info.entity";


@Entity()
export class Store extends Info{
    @Column({name: "vendor_id", nullable: true})
    vendorId: number
}