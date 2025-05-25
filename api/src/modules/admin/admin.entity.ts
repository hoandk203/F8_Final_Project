import {Column, Entity} from "typeorm";
import {Base} from "../base/base.entity";

@Entity("admin")
export class Admin extends Base{
    @Column()
    email: string;

    @Column({name: "user_id", nullable: true})
    userId: number;
} 