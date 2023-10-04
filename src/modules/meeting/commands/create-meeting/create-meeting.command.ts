import { CommandBase, CommandProps } from '../../../../libs/ddd/command.base';

export class CreateMeetingCommand extends CommandBase {
  readonly title: string;

  readonly callerId: string;

  constructor(props: CommandProps<CreateMeetingCommand>) {
    super(props);
    this.title = props.title;
  }
}
