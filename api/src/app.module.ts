import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthsModule } from './auths/auths.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60000, // Time window in milliseconds (1 minute)
        limit: 200, // Maximum number of requests per time window - increased for dashboard parallel requests
      }]
    }),
    DatabaseModule,
    AuthsModule,
    UsersModule,
    TeamsModule,
    ProjectsModule,
    TasksModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
