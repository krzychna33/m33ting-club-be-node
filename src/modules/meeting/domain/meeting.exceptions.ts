import { ExceptionBase } from '../../../libs/exceptions/exception.base';

export class UserAlreadyJoined extends ExceptionBase {
  static message = 'User already joined';
  constructor(message = UserAlreadyJoined.message) {
    super(message);
  }

  code = 'USER_ALREADY_JOINED';
}

export class MeetingIsFull extends ExceptionBase {
  static message = 'Meeting is full';
  constructor(message = MeetingIsFull.message) {
    super(message);
  }

  code = 'MEETING_IS_FULL';
}

export class MeetingNotFound extends ExceptionBase {
  static message = 'Meeting not found';
  constructor(message = MeetingNotFound.message) {
    super(message);
  }

  code = 'MEETING_NOT_FOUND';
}

export class UserIsNotMemberOfMeeting extends ExceptionBase {
  static message = 'User is not member of meeting';
  constructor(message = UserIsNotMemberOfMeeting.message) {
    super(message);
  }

  code = 'USER_IS_NOT_MEMBER_OF_MEETING';
}
