import { AggregateID, EntityBase } from '../../../libs/ddd/entity.base';
import { v4 } from 'uuid';

export type MeetingMemberProps = {
  userId: string;
  meetingId: string;
};

export type CreateMeetingMemberProps = {
  userId: string;
  meetingId: string;
};

export class MeetingMember extends EntityBase<MeetingMemberProps> {
  protected _id: AggregateID;

  validate(): void {}

  static create(props: CreateMeetingMemberProps) {
    return new MeetingMember({
      id: v4(),
      props: {
        userId: props.userId,
        meetingId: props.meetingId,
      },
    });
  }
}
