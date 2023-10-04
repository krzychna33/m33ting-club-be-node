import { QueryBase } from '../../../../libs/ddd/query.base';

export class GetUserJoinedMeetingsQuery extends QueryBase {
  readonly userId: string;

  constructor(userId: string) {
    super();
    this.userId = userId;
  }
}
