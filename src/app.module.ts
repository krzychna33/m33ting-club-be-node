import { Module } from '@nestjs/common';
import { MeetingModule } from './modules/meeting/meeting.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContextInterceptor } from './libs/application/context/ContextInterceptor';
import { CqrsModule } from '@nestjs/cqrs';
import { MeetingRepository } from './modules/meeting/database/meeting.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingDbModel } from './modules/meeting/database/meeting.db-model';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { UserDbModel } from './modules/user/database/user.db-model';
import { MeetingMemberDbModel } from './modules/meeting/database/meeting-member.db-model';

@Module({
  imports: [
    MeetingModule,
    CqrsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'm33tingclub',
      entities: [MeetingDbModel, UserDbModel, MeetingMemberDbModel],
      synchronize: true,
      logging: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ContextInterceptor,
    },
  ],
})
export class AppModule {}
