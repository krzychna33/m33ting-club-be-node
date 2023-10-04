import { Module } from '@nestjs/common';
import { CreateMeetingCommandHandler } from './commands/create-meeting/create-meeting.command-handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingDbModel } from './database/meeting.db-model';
import { MeetingRepository } from './database/meeting.repository';
import { MeetingMapper } from './meeting.mapper';
import { CqrsModule } from '@nestjs/cqrs';
import { RequestContextModule } from 'nestjs-request-context';
import { MeetingsController } from './meetings.controller';
import { AuthModule } from '../auth/auth.module';
import { JoinMeetingCommandHandler } from './commands/join-meeting/join-meeting.command-handler';
import { LeaveMeetingCommandHandler } from './commands/leave-meeting/leave-meeting.command-handler';
import { GetUserJoinedMeetingsQueryHandler } from './queries/get-user-joined-meetings/get-user-joined-meetings.query-handler';

@Module({
  imports: [
    RequestContextModule,
    TypeOrmModule.forFeature([MeetingDbModel]),
    CqrsModule,
    AuthModule,
  ],
  controllers: [MeetingsController],
  providers: [
    CreateMeetingCommandHandler,
    MeetingRepository,
    MeetingMapper,
    JoinMeetingCommandHandler,
    LeaveMeetingCommandHandler,
    GetUserJoinedMeetingsQueryHandler,
  ],
})
export class MeetingModule {}
