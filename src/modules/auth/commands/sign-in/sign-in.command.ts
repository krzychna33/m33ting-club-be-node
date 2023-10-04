import { CommandBase, CommandProps } from '../../../../libs/ddd/command.base';

export class SignInCommand extends CommandBase {
  readonly email: string;
  readonly password: string;

  constructor(props: CommandProps<SignInCommand>) {
    super(props);
    this.email = props.email;
    this.password = props.password;
  }
}
