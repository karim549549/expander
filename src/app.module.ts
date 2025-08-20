import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeORM dynamic config: prefer DATABASE_URL (Railway) else use individual MYSQL_* vars
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        if (databaseUrl) {
          return {
            type: 'mysql',
            url: databaseUrl,
            synchronize: config.get('MYSQL_SYNCHRONIZE') === 'true',
            logging: false,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
          } as any;
        }

        return {
          type: 'mysql',
          host: config.get('MYSQL_HOST', '127.0.0.1'),
          port: parseInt(config.get('MYSQL_PORT', '3306'), 10),
          username: config.get('MYSQL_USER', 'root'),
          password: config.get('MYSQL_PASSWORD', ''),
          database: config.get('MYSQL_DATABASE', 'expander_db'),
          synchronize: config.get('MYSQL_SYNCHRONIZE') === 'true',
          logging: false,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        } as any;
      },
    }),

    // Mongoose dynamic config: prefer MONGO_ATLAS_URI else MONGO_URI
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const atlas = config.get<string>('MONGO_ATLAS_URI');
        if (atlas) {
          return {
            uri: atlas,
          };
        }
        return {
          uri: config.get<string>(
            'MONGO_URI',
            'mongodb://127.0.0.1:27017/expander_mongo',
          ),
        };
      },
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
