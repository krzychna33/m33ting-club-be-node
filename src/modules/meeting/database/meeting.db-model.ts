import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MeetingMemberDbModel } from './meeting-member.db-model';

@Entity({ name: 'meetings' })
export class MeetingDbModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('timestamptz')
  createdAt: Date;

  @Column('timestamptz')
  updatedAt: Date;

  @OneToMany(() => MeetingMemberDbModel, (member) => member.meeting, {
    cascade: ['insert', 'remove'],
  })
  members: MeetingMemberDbModel[];
}
