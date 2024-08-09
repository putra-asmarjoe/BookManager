import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookService } from './book.service';
import { Book } from './book.entity';

describe('BookService', () => {
  let service: BookService;
  let repository: Repository<Book>;

  const mockBooksRepository = {
    find: jest.fn().mockResolvedValue([
      { id: 1, title: 'Book 1', author: 'Author 1', stock: 5 },
      { id: 2, title: 'Book 2', author: 'Author 2', stock: 3 },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBooksRepository,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result = await service.findAll();
      expect(result).toEqual([
        { id: 1, title: 'Book 1', author: 'Author 1', stock: 5 },
        { id: 2, title: 'Book 2', author: 'Author 2', stock: 3 },
      ]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });
});
