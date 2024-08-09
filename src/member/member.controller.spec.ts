import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { Member } from './member.entity';

describe('MemberController', () => {
  let controller: MemberController;
  let service: MemberService;

  const mockMemberService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        {
          provide: MemberService,
          useValue: mockMemberService,
        },
      ],
    }).compile();

    controller = module.get<MemberController>(MemberController);
    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllMembers', () => {
    it('should return an array of members', async () => {
      const result: Member[] = [
        { id: 1, code: 'M001', name: 'Angga', penalty: 0, penaltyEndDate: new Date('2023-01-01T00:00:00Z') },
        { id: 2, code: 'M002', name: 'Ferry', penalty: 0, penaltyEndDate: new Date('2023-01-01T00:00:00Z') },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.getAllMembers()).toBe(result);
    });
  });
});
