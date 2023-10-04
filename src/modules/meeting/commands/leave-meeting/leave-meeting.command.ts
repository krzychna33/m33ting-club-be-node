import { CommandBase, CommandProps } from '../../../../libs/ddd/command.base';

export class LeaveMeetingCommand extends CommandBase {
  readonly meetingId: string;
  readonly userId: string;
  constructor(props: CommandProps<LeaveMeetingCommand>) {
    super(props);
    this.meetingId = props.meetingId;
    this.userId = props.userId;
  }
}
