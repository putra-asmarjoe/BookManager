import { Test, TestingModule } from '@nestjs/testing';
import { AlgoritmaController } from './algoritma.controller';
import { AlgoritmaService } from './algoritma.service';

describe('AlgoritmaController', () => {
  let controller: AlgoritmaController;
  let service: AlgoritmaService;

  const mockAlgoritmaService = {
    reverseAlphabet: jest.fn(),
    longestWord: jest.fn(),
    countOccurrences: jest.fn(),
    diagonalDifference: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlgoritmaController],
      providers: [
        {
          provide: AlgoritmaService,
          useValue: mockAlgoritmaService,
        },
      ],
    }).compile();

    controller = module.get<AlgoritmaController>(AlgoritmaController);
    service = module.get<AlgoritmaService>(AlgoritmaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('reverseAlphabet', () => {
    it('should return reversed alphabet with number at the end', async () => {
      const input = 'NEGIE1';
      const result = 'EIGEN1';
      (mockAlgoritmaService.reverseAlphabet as jest.Mock).mockResolvedValue(result);

      expect(await controller.reverseAlphabet(input)).toBe(result);
    });
  });

  describe('longestWord', () => {
    it('should return the longest word in a sentence', async () => {
      const sentence = 'Saya sangat senang mengerjakan soal algoritma';
      const result = 'mengerjakan: 11 character';
      (mockAlgoritmaService.longestWord as jest.Mock).mockResolvedValue(result);

      expect(await controller.longestWord(sentence)).toBe(result);
    });
  });

  describe('countOccurrences', () => {
    it('should return count of occurrences of query strings in input array', async () => {
      const input = ['xc', 'dz', 'bbb', 'dz'];
      const query = ['bbb', 'ac', 'dz'];
      const result = [1, 0, 2];
      (mockAlgoritmaService.countOccurrences as jest.Mock).mockResolvedValue(result);

      expect(await controller.countOccurrences(input, query)).toBe(result);
    });
  });

  describe('diagonalDifference', () => {
    it('should return the difference between sums of matrix diagonals', async () => {
      const matrix = [
        [1, 2, 0],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const result = 3;
      (mockAlgoritmaService.diagonalDifference as jest.Mock).mockResolvedValue(result);

      expect(await controller.diagonalDifference(JSON.stringify(matrix))).toBe(result);
    });
  });
});
