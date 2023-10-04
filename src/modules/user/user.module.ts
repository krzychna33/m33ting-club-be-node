import { Module } from '@nestjs/common';
import { CreateUserIfNotExistsCommandHandler } from './commands/create-user-if-not-exists/create-user-if-not-exists.command-handler';
import { UserRepository } from './database/user.repository';
import { RequestContextModule } from 'nestjs-request-context';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UserDbModel } from './database/user.db-model';
import { UserMapper } from './user.mapper';
import { FindUserByIdQueryHandler } from './queries/find-user-by-id/find-user-by-id.query-handler';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    RequestContextModule,
    TypeOrmModule.forFeature([UserDbModel]),
    CqrsModule,
    AuthModule,
  ],
  providers: [
    CreateUserIfNotExistsCommandHandler,
    UserRepository,
    UserMapper,
    FindUserByIdQueryHandler,
  ],
  controllers: [UsersController],
})
export class UserModule {}
