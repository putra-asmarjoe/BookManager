import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrow } from './borrow.entity';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { Member } from '../member/member.entity';
import { Book } from '../book/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrow, Member, Book]),
  ],
  controllers: [BorrowController],
  providers: [BorrowService],
})
export class BorrowModule {}
