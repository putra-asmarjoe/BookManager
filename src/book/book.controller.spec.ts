import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookDto } from './book.dto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './book.entity';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  const mockBooksService = {
    findAll: jest.fn().mockResolvedValue([
      { id: 1, title: 'Book 1', author: 'Author 1', stock: 5 },
      { id: 2, title: 'Book 2', author: 'Author 2', stock: 3 },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllBooks', () => {
    it('should return an array of books', async () => {
      const result = await controller.getAllBooks();
      expect(result).toEqual([
        { id: 1, title: 'Book 1', author: 'Author 1', stock: 5 },
        { id: 2, title: 'Book 2', author: 'Author 2', stock: 3 },
      ]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
