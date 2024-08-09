import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { BooksModule } from './book/book.module';
import { MemberModule } from './member/member.module';
import { BorrowModule } from './borrow/borrow.modul';
import { AlgoritmaModule } from './algoritma/algoritma.module';
import { SeederService } from './seeder/seeder.service';

@Module({
  imports: [DatabaseModule, BooksModule, MemberModule, BorrowModule, AlgoritmaModule],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule {}
