import { AggregateRoot } from '../../libs/ddd/aggregate-root.base';
import { AggregateID } from '../../libs/ddd/entity.base';

export type UserProps = {
  email: string;
};

export class User extends AggregateRoot<UserProps> {
  protected _id: AggregateID;

  validate(): void {}

  static create(props: UserProps, id: AggregateID): User {
    return new User({
      id,
      props: {
        email: props.email,
      },
    });
  }
}
