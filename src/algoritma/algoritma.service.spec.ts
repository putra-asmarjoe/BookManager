import { Test, TestingModule } from '@nestjs/testing';
import { AlgoritmaService } from './algoritma.service';

describe('AlgoritmaService', () => {
  let service: AlgoritmaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlgoritmaService],
    }).compile();

    service = module.get<AlgoritmaService>(AlgoritmaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reverseAlphabet', () => {
    it('should reverse alphabet and append number', () => {
      const input = 'NEGIE1';
      const result = 'EIGEN1';
      expect(service.reverseAlphabet(input)).toBe(result);
    });

    it('should handle input with no numbers', () => {
      const input = 'HELLO';
      const result = 'OLLEH';
      expect(service.reverseAlphabet(input)).toBe(result);
    });

    it('should handle input with no letters', () => {
      const input = '1234';
      const result = '1234';
      expect(service.reverseAlphabet(input)).toBe(result);
    });

    it('should handle empty input', () => {
      const input = '';
      const result = '';
      expect(service.reverseAlphabet(input)).toBe(result);
    });
  });

  describe('longestWord', () => {
    it('should return the longest word with its length', () => {
      const sentence = 'Saya sangat senang mengerjakan soal algoritma';
      const result = 'mengerjakan: 11 character';
      expect(service.longestWord(sentence)).toBe(result);
    });
  
    it('should handle a sentence with multiple longest words', () => {
      const sentence = 'A B C D E F';
      const result = 'F: 1 character';  // Ini sesuai dengan logika baru
      expect(service.longestWord(sentence)).toBe(result);
    });
  
    it('should handle a sentence with a single word', () => {
      const sentence = 'Hello';
      const result = 'Hello: 5 character';
      expect(service.longestWord(sentence)).toBe(result);
    });
  
    it('should handle empty sentence', () => {
      const sentence = '';
      const result = ': 0 character';
      expect(service.longestWord(sentence)).toBe(result);
    });
  });

  describe('countOccurrences', () => {
    it('should return count of occurrences of query strings in input array', () => {
      const input = ['xc', 'dz', 'bbb', 'dz'];
      const query = ['bbb', 'ac', 'dz'];
      const result = [1, 0, 2];
      expect(service.countOccurrences(input, query)).toEqual(result);
    });

    it('should handle empty input and query arrays', () => {
      const input: string[] = [];
      const query: string[] = [];
      const result: number[] = [];
      expect(service.countOccurrences(input, query)).toEqual(result);
    });

    it('should handle empty input array', () => {
      const input: string[] = [];
      const query = ['a', 'b'];
      const result = [0, 0];
      expect(service.countOccurrences(input, query)).toEqual(result);
    });

    it('should handle empty query array', () => {
      const input = ['a', 'b'];
      const query: string[] = [];
      const result: number[] = [];
      expect(service.countOccurrences(input, query)).toEqual(result);
    });
  });

  describe('diagonalDifference', () => {
    it('should return the difference between sums of matrix diagonals', () => {
      const matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]];
      const result = 3;
      expect(service.diagonalDifference(matrix)).toBe(result);
    });

    it('should handle a 1x1 matrix', () => {
      const matrix = [[1]];
      const result = 0;
      expect(service.diagonalDifference(matrix)).toBe(result);
    });

    it('should handle a 2x2 matrix', () => {
      const matrix = [[1, 2], [3, 4]];
      const result = 0;
      expect(service.diagonalDifference(matrix)).toBe(result);
    });

    it('should handle an empty matrix', () => {
      const matrix: number[][] = [];
      const result = 0;
      expect(service.diagonalDifference(matrix)).toBe(result);
    });
  });
});
