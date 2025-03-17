import { Entity, Column, Index } from 'typeorm';
import { Base } from 'src/modules/base/base.entity';

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum CreatorRole {
  ADMIN = 'admin',
  STORE = 'store',
  DRIVER = 'driver'
}

@Entity('issue')
export class Issue extends Base{

  @Column({name: 'user_id', nullable: true})
  @Index()
  userId: number;

  @Column({name: 'order_id'})
  @Index()
  orderId: number;

  @Column({name: 'store_id'})
  @Index()
  storeId: number;

  @Column({name: 'driver_id', nullable: true})
  @Index()
  driverId: number;

  @Column({name: 'issue_name'})
  issueName: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: IssueStatus,
    default: IssueStatus.OPEN
  })
  status: IssueStatus;

  @Column({
    name: 'creator_role',
    type: 'enum',
    enum: CreatorRole
  })
  creatorRole: CreatorRole;

  @Column({ name: 'resolved_at', nullable: true })
  resolvedAt: Date;

  @Column({ name: 'issue_image_url', nullable: false})
  issueImageUrl: string;

  @Column({name: 'message_count', default: 0})
  messageCount: number;
}