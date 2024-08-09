import { Injectable } from '@nestjs/common';

@Injectable()
export class AlgoritmaService {
  reverseAlphabet(str: string): string {
    const alphabet = str.replace(/[0-9]/g, '').split('').reverse().join('');
    const number = str.replace(/[a-zA-Z]/g, '');
    return alphabet + number;
  }

  longestWord(sentence: string): string {
    const words = sentence.split(' ');
    let longest = '';

    for (const word of words) {
      if (word.length > longest.length) {
        longest = word;
      }
    }

    return `${longest}: ${longest.length} character`;
  }

  countOccurrences(INPUT: string[], QUERY: string[]): number[] {
    return QUERY.map((q) => INPUT.filter((item) => item === q).length);
  }

  diagonalDifference(matrix: number[][]): number {
    let diagonal1 = 0;
    let diagonal2 = 0;

    for (let i = 0; i < matrix.length; i++) {
      diagonal1 += matrix[i][i];
      diagonal2 += matrix[i][matrix.length - 1 - i];
    }

    return Math.abs(diagonal1 - diagonal2);
  }
}
