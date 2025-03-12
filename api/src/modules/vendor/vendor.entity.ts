import {Column, Entity} from "typeorm";
import {Base} from "../base/base.entity";

@Entity("vendor")
export class Vendor extends Base{
    @Column()
    name: string

    @Column()
    email: string;
}