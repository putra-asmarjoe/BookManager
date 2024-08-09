import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Borrow } from './borrow.entity';
import { Member } from '../member/member.entity';
import { Book } from '../book/book.entity';
import { CreateBorrowDto } from './borrow.dto';

const overduePeriodDays = parseInt(process.env.OVERDUE_PERIOD_DAYS, 10) || 7;
const penaltyPeriodDays = parseInt(process.env.PENALTY_PERIOD_DAYS, 10) || 3;
const maxMemberBorrowBooks = parseInt(process.env.MAX_MEMBER_BORROW, 10) || 32;

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow)
    private readonly borrowsRepository: Repository<Borrow>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Borrow[]> {
    return this.borrowsRepository.find({ relations: ['member', 'book'] });
  }

  async findOne(id: number): Promise<Borrow> {
    const borrow = await this.borrowsRepository.findOne({
      where: { id },
      relations: ['member', 'book'],
    });

    if (!borrow) {
      throw new NotFoundException(`Borrow with ID ${id} not found`);
    }

    return borrow;
  }

  async create(createBorrowDto: CreateBorrowDto): Promise<Borrow> {
    const { memberId, bookId, borrowDate } = createBorrowDto;

    const member = await this.membersRepository.findOne({
      where: { id: memberId },
    });
    const book = await this.booksRepository.findOne({ where: { id: bookId } });

    if (!member || !book) {
      throw new NotFoundException('Member or Book not found');
    }

    // Validate the borrowDate: It should not be in the future.
    const borrowDateObject = new Date(borrowDate);
    borrowDateObject.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for comparison

    if (borrowDateObject > today) {
      throw new NotFoundException('Borrow date cannot be in the future');
    }
    const currentYear = today.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);

    if (borrowDateObject < startOfYear) {
      throw new NotFoundException(
        'Borrow date cannot be before the start of this year',
      );
    }

    const penaltyEndDate = new Date(member.penaltyEndDate);
    penaltyEndDate.setHours(0, 0, 0, 0);
    // Check if the member is currently penalized
    if (member.penalty > 0) {
      if (penaltyEndDate >= borrowDateObject) {
        const formattedPenaltyEndDate = penaltyEndDate.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
      
          throw new NotFoundException(
            `Member is currently penalized and cannot borrow books. The member can borrow books again after ${formattedPenaltyEndDate}.`,
          );
      }
    }

    // Check if the member has already borrowed 2 books
    const borrowedBooksCount = await this.borrowsRepository.count({
      where: { member, returnDate: IsNull() },
    });

    if (borrowedBooksCount >= maxMemberBorrowBooks) {
      throw new NotFoundException(
        `Member cannot borrow more than ${maxMemberBorrowBooks} books`,
      );
    }

    const isBookBorrowed = await this.borrowsRepository.findOne({
      where: {
        book,
        returnDate: IsNull(),
      },
    });

    if (isBookBorrowed) {
      throw new NotFoundException('Book is already borrowed by member');
    }

    // Check if the member is currently penalized
    if (member.penalty > 0) {
      // Remove penalty for the member if passed to borrow

      member.penalty = 0;
      member.penaltyEndDate = new Date('2023-01-01T08:00:00');

      await this.membersRepository.save(member);
    }

    const borrow = this.borrowsRepository.create({ member, book, borrowDate });

    return this.borrowsRepository.save(borrow);
  }

  async update(id: number, updateData: Partial<Borrow>): Promise<Borrow> {
    const borrow = await this.borrowsRepository.findOne({
      where: { id },
      relations: ['member', 'book'],
    });

    if (!borrow) {
      throw new NotFoundException(`Borrow with ID ${id} not found`);
    }

    if (borrow.returnDate !== null) {
      throw new NotFoundException(`Book already returned`);
    }

    if (updateData.returnDate) {
      const returnDate = new Date(updateData.returnDate);
      const borrowDate = new Date(borrow.borrowDate);

      const diffTime = returnDate.getTime() - borrowDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      borrow.returnDate = returnDate;
      borrow.isLate = diffDays > overduePeriodDays;
    }

    if (borrow.isLate === true) {
      const member = borrow.member;

      if (member.penalty === 1 && member.penaltyEndDate > new Date()) {
        member.penaltyEndDate = new Date(
          member.penaltyEndDate.setDate(
            member.penaltyEndDate.getDate() + penaltyPeriodDays,
          ),
        );
      } else {
        member.penalty = 1;
        member.penaltyEndDate = new Date(
          new Date().setDate(
            new Date(updateData.returnDate).getDate() + penaltyPeriodDays,
          ),
        );
      }
      await this.membersRepository.save(member);
    }

    Object.assign(borrow, {
      returnDate: updateData.returnDate,
      isLate: borrow.isLate,
    });

    return this.borrowsRepository.save(borrow);
  }
}
