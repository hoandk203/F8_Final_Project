import {Column, Entity} from "typeorm";
import {Base} from "../base/base.entity";


@Entity()
export class Material extends Base{
    @Column()
    name: string

    @Column({
        name: "unit_price",
        type: "numeric",
        precision: 10,
        scale: 2
    })
    unitPrice: number
}