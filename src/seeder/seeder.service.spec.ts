import { Test, TestingModule } from '@nestjs/testing';
import { SeederService } from './seeder.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../book/book.entity';
import { Member } from '../member/member.entity';

describe('SeederService', () => {
  let seederService: SeederService;
  let bookRepository: Repository<Book>;
  let memberRepository: Repository<Member>;

  const mockBookRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockMemberRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository,
        },
      ],
    }).compile();

    seederService = module.get<SeederService>(SeederService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    memberRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
  });

  it('should be defined', () => {
    expect(seederService).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call seedBooks and seedMembers', async () => {
      // Mock the private methods as needed
      const seedBooks = jest.spyOn(seederService as any, 'seedBooks').mockImplementation(async () => {});
      const seedMembers = jest.spyOn(seederService as any, 'seedMembers').mockImplementation(async () => {});

      await seederService.onModuleInit();

      expect(seedBooks).toHaveBeenCalled();
      expect(seedMembers).toHaveBeenCalled();
    });
  });
});
