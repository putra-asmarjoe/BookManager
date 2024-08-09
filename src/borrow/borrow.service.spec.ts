import { Test, TestingModule } from '@nestjs/testing';
import { BorrowService } from './borrow.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrow } from './borrow.entity';
import { Member } from '../member/member.entity';
import { Book } from '../book/book.entity';
import { NotFoundException } from '@nestjs/common';

describe('BorrowService', () => {
  let service: BorrowService;
  let borrowsRepository: Repository<Borrow>;
  let membersRepository: Repository<Member>;
  let booksRepository: Repository<Book>;

  const mockBorrowsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
  };

  const mockMembersRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockBooksRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowService,
        {
          provide: getRepositoryToken(Borrow),
          useValue: mockBorrowsRepository,
        },
        {
          provide: getRepositoryToken(Member),
          useValue: mockMembersRepository,
        },
        {
          provide: getRepositoryToken(Book),
          useValue: mockBooksRepository,
        },
      ],
    }).compile();

    service = module.get<BorrowService>(BorrowService);
    borrowsRepository = module.get<Repository<Borrow>>(getRepositoryToken(Borrow));
    membersRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    booksRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of borrows', async () => {
      const result: Borrow[] = [
        {
          id: 1,
          member: {} as Member,
          book: {} as Book,
          borrowDate: new Date(),
          returnDate: null,
          isLate: false,
        },
      ];
      jest.spyOn(borrowsRepository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a borrow by ID', async () => {
      const result: Borrow = {
        id: 1,
        member: {} as Member,
        book: {} as Book,
        borrowDate: new Date(),
        returnDate: null,
        isLate: false,
      };
      jest.spyOn(borrowsRepository, 'findOne').mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
    });

    it('should throw NotFoundException if borrow not found', async () => {
      jest.spyOn(borrowsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new borrow', async () => {
      const createBorrowDto = {
        memberId: 1,
        bookId: 1,
        borrowDate: new Date(),
      };
      const member = { id: 1, penalty: 0, penaltyEndDate: new Date() } as Member;
      const book = { id: 1 } as Book;
      const result: Borrow = {
        id: 1,
        member,
        book,
        borrowDate: createBorrowDto.borrowDate,
        returnDate: null,
        isLate: false,
      };

      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(member);
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(book);
      jest.spyOn(borrowsRepository, 'create').mockReturnValue(result);
      jest.spyOn(borrowsRepository, 'save').mockResolvedValue(result);

      expect(await service.create(createBorrowDto)).toBe(result);
    });

    it('should throw NotFoundException if member or book not found', async () => {
      const createBorrowDto = {
        memberId: 1,
        bookId: 1,
        borrowDate: new Date(),
      };
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue({ id: 1 } as Book);

      await expect(service.create(createBorrowDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if borrowDate is in the future', async () => {
      const createBorrowDto = {
        memberId: 1,
        bookId: 1,
        borrowDate: new Date(Date.now() + 86400000), // Future date
      };
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue({ id: 1 } as Member);
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue({ id: 1 } as Book);

      await expect(service.create(createBorrowDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a borrow', async () => {
      const updateData = { returnDate: new Date() };
      const borrow: Borrow = {
        id: 1,
        member: {} as Member,
        book: {} as Book,
        borrowDate: new Date(),
        returnDate: null,
        isLate: false,
      };
      const result: Borrow = {
        ...borrow,
        ...updateData,
        isLate: true,
      };

      jest.spyOn(borrowsRepository, 'findOne').mockResolvedValue(borrow);
      jest.spyOn(borrowsRepository, 'save').mockResolvedValue(result);

      expect(await service.update(1, updateData)).toBe(result);
    });

    it('should throw NotFoundException if borrow not found', async () => {
      jest.spyOn(borrowsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, { returnDate: new Date() })).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if book already returned', async () => {
      const borrow: Borrow = {
        id: 1,
        member: {} as Member,
        book: {} as Book,
        borrowDate: new Date(),
        returnDate: new Date(),
        isLate: false,
      };
      jest.spyOn(borrowsRepository, 'findOne').mockResolvedValue(borrow);

      await expect(service.update(1, { returnDate: new Date() })).rejects.toThrow(NotFoundException);
    });
  });
});
