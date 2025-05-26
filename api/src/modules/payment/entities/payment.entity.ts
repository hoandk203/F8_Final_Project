import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '../../order/order.entity';

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
    CANCELED = 'canceled',
}

export enum PaymentMethod {
    VNPAY = 'vnpay',
    CASH = 'cash',
    BANK_TRANSFER = 'bank_transfer',
}

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: number;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column({
        type: "numeric",
        nullable: true
    })
    amount: number;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    status: PaymentStatus;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.VNPAY
    })
    method: PaymentMethod;

    @Column({ nullable: true })
    transactionId: string;

    @Column({ nullable: true })
    transactionRef: string;

    @Column({ type: 'json', nullable: true })
    paymentData: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({default: true})
    active: boolean

    @Column({ nullable: true })
    paymentUrl: string
} 