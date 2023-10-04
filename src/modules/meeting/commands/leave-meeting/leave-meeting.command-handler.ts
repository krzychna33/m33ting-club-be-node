import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LeaveMeetingCommand } from './leave-meeting.command';
import { MeetingRepository } from '../../database/meeting.repository';
import { Err, Ok, Result } from 'oxide.ts';
import { Meeting } from '../../domain/Meeting';
import { MeetingNotFound } from '../../domain/meeting.exceptions';

@CommandHandler(LeaveMeetingCommand)
export class LeaveMeetingCommandHandler implements ICommandHandler {
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async execute(
    command: LeaveMeetingCommand,
  ): Promise<Result<Meeting, unknown>> {
    const meeting = await this.meetingRepository.findOneById(command.meetingId);

    if (!meeting) {
      return Err(new MeetingNotFound());
    }

    try {
      meeting.leave(command.userId);
    } catch (e) {
      return Err(e);
    }

    await this.meetingRepository.update(meeting);

    return Ok(meeting);
  }
}
