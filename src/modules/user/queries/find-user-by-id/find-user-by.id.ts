import { QueryBase } from '../../../../libs/ddd/query.base';

export class FindUserById extends QueryBase {
  readonly userId: string;

  constructor(props: { userId: string }) {
    super();
    this.userId = props.userId;
  }
}
