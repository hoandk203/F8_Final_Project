import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('refresh_token')
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column({
        nullable: true
    })
    uuid: string;

    @Column()
    userId: number;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @Column({
        nullable: true,
        default: () => "CURRENT_TIMESTAMP(6)"
    })
    createdAt: Date
}
