import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Base} from "../../base/base.entity";

@Entity('user')
export class User extends Base{
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @Column({ nullable: true })
    name: string;
}
