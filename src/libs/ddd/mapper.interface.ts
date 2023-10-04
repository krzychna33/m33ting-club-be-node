import { EntityBase } from './entity.base';

export interface Mapper<
  DomainEntity extends EntityBase<any>,
  DbModel,
  Response = any,
> {
  toPersistence(entity: DomainEntity): DbModel;
  toDomain(record: any): DomainEntity;
  toResponse(entity: DomainEntity): Response;
}
