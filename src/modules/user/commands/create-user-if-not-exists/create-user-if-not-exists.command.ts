import { CommandBase, CommandProps } from '../../../../libs/ddd/command.base';

export class CreateUserIfNotExistsCommand extends CommandBase {
  readonly email: string;
  readonly userId: string;

  constructor(props: CommandProps<CreateUserIfNotExistsCommand>) {
    super(props);
    this.email = props.email;
    this.userId = props.userId;
  }
}
