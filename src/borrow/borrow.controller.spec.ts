import { Test, TestingModule } from '@nestjs/testing';
import { BorrowController } from './borrow.controller';
import { BorrowService } from './borrow.service';
import { Borrow } from './borrow.entity';
import { Book } from '../book/book.entity';
import { Member } from '../member/member.entity';
import { NotFoundException } from '@nestjs/common';

describe('BorrowController', () => {
  let controller: BorrowController;
  let service: BorrowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowController],
      providers: [
        {
          provide: BorrowService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BorrowController>(BorrowController);
    service = module.get<BorrowService>(BorrowService);
  });

  describe('getAllBorrows', () => {
    it('should return an array of borrows', async () => {
      const result: Borrow[] = [
        {
          id: 1,
          member: { id: 1, code: 'M001', name: 'John Doe', penalty: 0, penaltyEndDate: null },
          book: { id: 1, code: 'B001', title: 'Book Title', author: 'Author Name', stock: 10 },
          borrowDate: new Date(),
          returnDate: null,
          isLate: false,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.getAllBorrows()).toEqual(result);
    });
  });

  describe('getBorrow', () => {
    it('should return a single borrow record', async () => {
      const result: Borrow = {
        id: 1,
        member: { id: 1, code: 'M001', name: 'John Doe', penalty: 0, penaltyEndDate: null },
        book: { id: 1, code: 'B001', title: 'Book Title', author: 'Author Name', stock: 10 },
        borrowDate: new Date(),
        returnDate: null,
        isLate: false,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.getBorrow(1)).toEqual(result);
    });

    it('should throw a NotFoundException if borrow not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.getBorrow(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new borrow record', async () => {
      const createBorrowDto = {
        memberId: 1,
        bookId: 1,
        borrowDate: new Date(),
      };

      const result: Borrow = {
        id: 1,
        member: { id: 1, code: 'M001', name: 'John Doe', penalty: 0, penaltyEndDate: null },
        book: { id: 1, code: 'B001', title: 'Book Title', author: 'Author Name', stock: 10 },
        borrowDate: new Date(),
        returnDate: null,
        isLate: false,
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createBorrowDto)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update an existing borrow record', async () => {
      const updateBorrowDto = {
        returnDate: new Date(),
      };

      const result: Borrow = {
        id: 1,
        member: { id: 1, code: 'M001', name: 'John Doe', penalty: 0, penaltyEndDate: null },
        book: { id: 1, code: 'B001', title: 'Book Title', author: 'Author Name', stock: 10 },
        borrowDate: new Date(),
        returnDate: new Date(),
        isLate: false,
      };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, updateBorrowDto)).toEqual(result);
    });
  });
});
