import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV_LOCAL_FILE_PATH } from './common/constants/env.constants';
import {
  DB_DEFAULT_HOST,
  DB_DEFAULT_NAME,
  DB_DEFAULT_PASSWORD,
  DB_DEFAULT_PORT,
  DB_DEFAULT_USER,
  DB_HOST_KEY,
  DB_NAME_KEY,
  DB_PASSWORD_KEY,
  DB_PORT_KEY,
  DB_TYPE,
  DB_USER_KEY,
} from './common/constants/database.constants';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ENV_LOCAL_FILE_PATH }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: DB_TYPE,
        host: configService.get<string>(DB_HOST_KEY) || DB_DEFAULT_HOST,
        port: configService.get<number>(DB_PORT_KEY) || DB_DEFAULT_PORT,
        username: configService.get<string>(DB_USER_KEY) || DB_DEFAULT_USER,
        password:
          configService.get<string>(DB_PASSWORD_KEY) || DB_DEFAULT_PASSWORD,
        database: configService.get<string>(DB_NAME_KEY) || DB_DEFAULT_NAME,
        synchronize: process.env.NODE_ENV !== 'production',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        autoLoadEntities: true,
        logging: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {}
}
