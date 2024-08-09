import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../book/book.entity';
import { Member } from '../member/member.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async onModuleInit() {
    await this.seedBooks();
    await this.seedMembers();
  }

  private async seedBooks() {
    const books = [
      { code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1 },
      { code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', stock: 1 },
      { code: 'TW-11', title: 'Twilight', author: 'Stephenie Meyer', stock: 1 },
      { code: 'HOB-83', title: 'The Hobbit, or There and Back Again', author: 'J.R.R. Tolkien', stock: 1 },
      { code: 'NRN-7', title: 'The Lion, the Witch and the Wardrobe', author: 'C.S. Lewis', stock: 1 },
    ];

    for (const book of books) {
      const exists = await this.bookRepository.findOne({ where: { code: book.code } });
      if (!exists) {
        await this.bookRepository.save(book);
      }
    }
  }

  private async seedMembers() {
    const members = [
      { code: 'M001', name: 'Angga', penalty: 0, penaltyEndDate: new Date('2023-01-01T00:00:00Z') },
      { code: 'M002', name: 'Ferry', penalty: 0, penaltyEndDate: new Date('2023-01-01T00:00:00Z') },
      { code: 'M003', name: 'Putri', penalty: 0, penaltyEndDate: new Date('2023-01-01T00:00:00Z') },
    ];

    for (const member of members) {
      const exists = await this.memberRepository.findOne({ where: { code: member.code } });
      if (!exists) {
        await this.memberRepository.save(member);
      }
    }
  }
}
