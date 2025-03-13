import {Column, Entity} from "typeorm";
import {Info} from "../base/info.entity";


@Entity()
export class Store extends Info{
    @Column({name: "user_id", nullable: true})
    userId: number

    @Column({name: "vendor_id", nullable: true})
    vendorId: number
    
    @Column({nullable: true})
    city: string
    
    @Column({nullable: true})
    phone: string
    
    @Column({name: "cancelled_order", default: 0})
    cancelledOrder: number
    
    @Column({name: "completed_order", default: 0})
    completedOrder: number
}