import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ENV_LOCAL_FILE_PATH } from './common/constants/env.constants';
import {
  DB_HOST_KEY,
  DB_NAME_KEY,
  DB_PASSWORD_KEY,
  DB_PORT_KEY,
  DB_TYPE,
  DB_USER_KEY,
  MONGO_URI_KEY,
} from './common/constants/database.constants';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ProjectsModule } from './projects/projects.module';
import { VendorsModule } from './vendors/vendors.module';
import { MatchesModule } from './matches/matches.module';
import { ClientsModule } from './clients/clients.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    UsersModule,
    DocumentsModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ENV_LOCAL_FILE_PATH }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: DB_TYPE,
        host: configService.get<string>(DB_HOST_KEY),
        port: configService.get<number>(DB_PORT_KEY),
        username: configService.get<string>(DB_USER_KEY),
        password: configService.get<string>(DB_PASSWORD_KEY),
        database: configService.get<string>(DB_NAME_KEY),
        synchronize: process.env.NODE_ENV !== 'production',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        logging: true,
        keepConnectionAlive: true,
        dropSchema: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(MONGO_URI_KEY),
      }),
    }),
    AuthModule,
    EmailModule,
    ProjectsModule,
    VendorsModule,
    MatchesModule,
    ClientsModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {}
}
