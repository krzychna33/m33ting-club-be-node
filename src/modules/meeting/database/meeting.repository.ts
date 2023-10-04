import { MeetingDbModel } from './meeting.db-model';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingMapper } from '../meeting.mapper';
import { Injectable } from '@nestjs/common';
import { RepositoryBase } from '../../../libs/db/repository.base';
import { Meeting } from '../domain/Meeting';
import { Repository } from 'typeorm';
import { MeetingMemberDbModel } from './meeting-member.db-model';

@Injectable()
export class MeetingRepository extends RepositoryBase<
  Meeting,
  Omit<MeetingDbModel, 'members'> & {
    members: Omit<MeetingMemberDbModel, 'meeting' | 'user'>[];
  }
> {
  constructor(
    @InjectRepository(MeetingDbModel)
    protected readonly meetingsTypeormRepository: Repository<MeetingDbModel>,
    protected readonly meetingMapper: MeetingMapper,
  ) {
    super(meetingsTypeormRepository, meetingMapper);
  }

  async insertOne(meeting: Meeting): Promise<Meeting> {
    const meetingToSave = this.repository.create(
      this.mapper.toPersistence(meeting),
    );

    console.log(meetingToSave);

    await this.repository.save(meetingToSave, {});

    return meeting;
  }

  async findOneById(id: string): Promise<Meeting | null> {
    const meeting = await this.repository.findOne({
      where: { id },
      relations: ['members'],
    });

    return meeting ? this.mapper.toDomain(meeting) : null;
  }

  async update(meeting: Meeting): Promise<Meeting> {
    await this.repository.save(this.meetingMapper.toPersistence(meeting));

    return meeting;
  }
}
