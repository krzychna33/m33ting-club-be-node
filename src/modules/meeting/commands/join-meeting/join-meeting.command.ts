import { CommandBase, CommandProps } from '../../../../libs/ddd/command.base';

export class JoinMeetingCommand extends CommandBase {
  readonly meetingId: string;
  readonly userId: string;

  constructor(props: CommandProps<JoinMeetingCommand>) {
    super(props);
    this.meetingId = props.meetingId;
    this.userId = props.userId;
  }
}
