import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class Base{
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        name: 'created_at',
        nullable: true,
        default: () => "CURRENT_TIMESTAMP(6)"
    })
    createdAt: Date

    @Column({name: "created_by", nullable: true})
    createdBy: number

    @Column({name: "modified_at", nullable: true})
    modifiedAt: Date

    @Column({name: "modified_by", nullable: true})
    modifiedBy: number

    @Column({name: "deleted_at", nullable: true})
    deletedAt: Date

    @Column({name: "deleted_by", nullable: true})
    deletedBy: number

    @Column({default: true})
    active: boolean
}