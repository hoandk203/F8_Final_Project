import {Column, Entity} from "typeorm";
import {Base} from "../../base/base.entity";

@Entity()
export class User extends Base{
    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    role: string;
}
