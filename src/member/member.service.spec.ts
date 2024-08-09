import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';

describe('MemberService', () => {
  let service: MemberService;
  let repository: Repository<Member>;

  const mockMemberRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository,
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    repository = module.get<Repository<Member>>(getRepositoryToken(Member));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const result: Member[] = [
        { id: 1, code: 'M001', name: 'Angga', penalty: 0, penaltyEndDate: new Date('2023-01-01T00:00:00Z') },
        { id: 2, code: 'M002', name: 'Ferry', penalty: 0, penaltyEndDate: new Date('2023-01-01T00:00:00Z') },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });
});
