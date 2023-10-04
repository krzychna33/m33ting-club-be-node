import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { MeetingDbModel } from './meeting.db-model';
import { UserDbModel } from '../../user/database/user.db-model';

@Entity('meeting_member')
export class MeetingMemberDbModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  meetingId: string;

  @JoinColumn({ name: 'meetingId' })
  @ManyToOne(() => MeetingDbModel, (meeting) => meeting.members, {
    orphanedRowAction: 'delete',
  })
  meeting: MeetingDbModel;

  @Column()
  userId: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => UserDbModel, (user) => user.meetingMemberships)
  user: UserDbModel;

  @Column('timestamptz')
  createdAt: Date;

  @Column('timestamptz')
  updatedAt: Date;
}
