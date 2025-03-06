import { Entity, Column } from "typeorm";
import {Base} from "../../base/base.entity";

@Entity("driver")
export class Driver extends Base{

    @Column({name: "user_id", nullable: false})
    userId: number;

    @Column({name: "identity_document_id", nullable: false})
    identityDocumentId: number;

    @Column({nullable: false})
    fullname: string;

    @Column({name: "date_of_birth", nullable: false})
    dateOfBirth: string;

    @Column({name: "gst_number", nullable: false})
    gstNumber: string;

    @Column({nullable: false})
    address: string;

    @Column({nullable: false})
    city: string;

    @Column({nullable: false})
    country: string;

    @Column({name: "phone_number", nullable: true})
    phoneNumber: string;
}
