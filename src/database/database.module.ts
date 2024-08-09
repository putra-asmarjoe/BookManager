import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Book } from '../book/book.entity';
import { Member } from '../member/member.entity';
import { Borrow } from '../borrow/borrow.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // Pastikan ConfigModule diimport
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 3306,
        username: configService.get<string>('DB_USERNAME') || 'root',
        password: configService.get<string>('DB_PASSWORD') || 'password',
        database: configService.get<string>('DB_DATABASE') || 'nest',
        entities: [Book, Member, Borrow],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Book, Member, Borrow]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
