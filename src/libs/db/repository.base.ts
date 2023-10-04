import { Repository } from 'typeorm';
import { Mapper } from '../ddd/mapper.interface';
import { EntityBase } from '../ddd/entity.base';

export class RepositoryBase<DomainEntity extends EntityBase<any>, DbModel> {
  constructor(
    protected readonly repository: Repository<DbModel>,
    protected readonly mapper: Mapper<DomainEntity, DbModel>,
  ) {}

  async insertOne(meeting: DomainEntity): Promise<DomainEntity> {
    const meetingToSave = this.repository.create(
      this.mapper.toPersistence(meeting),
    );

    const insertedMeeting = await this.repository.save(meetingToSave);

    return this.mapper.toDomain(insertedMeeting);
  }
}
