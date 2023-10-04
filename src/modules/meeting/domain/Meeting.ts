import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base';
import { AggregateID } from '../../../libs/ddd/entity.base';
import { v4 } from 'uuid';
import { MeetingMember } from './MeetingMember';
import { ExceptionBase } from '../../../libs/exceptions/exception.base';
import {
  MeetingIsFull,
  UserAlreadyJoined,
  UserIsNotMemberOfMeeting,
} from './meeting.exceptions';

export type MeetingProps = {
  title: string;
  members: MeetingMember[];
};

export type CreateMeetingProps = {
  title: string;
};

export class Meeting extends AggregateRoot<MeetingProps> {
  protected _id: AggregateID;

  validate(): void {}

  static create(props: CreateMeetingProps) {
    return new Meeting({
      id: v4(),
      props: {
        title: props.title,
        members: [],
      },
    });
  }

  join(member: MeetingMember) {
    if (this.props.members.length >= 5) {
      throw new MeetingIsFull();
    }
    // if (
    //   this.props.members.find(
    //     (m) => m.getProps().userId === member.getProps().userId,
    //   )
    // ) {
    //   throw new UserAlreadyJoined();
    // }
    this.props.members.push(member);
  }

  leave(userId: string) {
    if (this.props.members.find((m) => m.getProps().userId === userId)) {
      this.props.members = this.props.members.filter(
        (m) => m.getProps().userId !== userId,
      );
    } else {
      throw new UserIsNotMemberOfMeeting();
    }
  }

  getMembers() {
    return this.props.members;
  }
}
