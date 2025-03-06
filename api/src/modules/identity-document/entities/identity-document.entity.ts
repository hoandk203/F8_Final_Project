import {Column, Entity} from "typeorm";
import {Base} from "../../base/base.entity";

@Entity("identity_document")
export class IdentityDocument extends Base {
    @Column({name: "user_id", nullable: false})
    userId: number

    @Column({name: "front_image_url", nullable: false})
    frontImageUrl: string

    @Column({name: "back_image_url", nullable: false})
    backImageUrl: string

    @Column({nullable: false})
    status: 'pending' | 'approved' | 'rejected';
}

