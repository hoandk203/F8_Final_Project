import { Entity, Column, Index } from 'typeorm';
import { Base } from 'src/modules/base/base.entity';

@Entity('issue_messages')
export class IssueMessage extends Base{
  @Column({name: 'issue_id'})
  @Index()
  issueId: number;

  @Column({name: 'sender_id'})
  @Index()
  senderId: number;

  @Column('text')
  message: string;

  @Column('simple-array', { name: "file_ids", nullable: true })
  fileIds: string[];
}