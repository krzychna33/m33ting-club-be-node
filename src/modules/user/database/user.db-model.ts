import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MeetingMemberDbModel } from '../../meeting/database/meeting-member.db-model';

@Entity({ name: 'users' })
export class UserDbModel {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column('timestamptz')
  createdAt: Date;

  @Column('timestamptz')
  updatedAt: Date;

  @OneToMany(() => MeetingMemberDbModel, (meetingMember) => meetingMember.user)
  meetingMemberships: MeetingMemberDbModel[];
}
