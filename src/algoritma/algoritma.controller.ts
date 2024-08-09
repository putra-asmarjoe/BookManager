import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AlgoritmaService } from './algoritma.service';

@Controller('algoritma')
export class AlgoritmaController {
  constructor(private readonly algoritmaService: AlgoritmaService) {}

  @Get('reverse-alphabet')
  @ApiOperation({ summary: 'Reverse alphabet with number at the end' })
  @ApiQuery({
    name: 'input',
    example: 'NEGIE1',
    description: 'Input string to be reversed',
  })
  @ApiResponse({ status: 200, description: 'EIGEN1' })
  reverseAlphabet(@Query('input') input: string) {
    return this.algoritmaService.reverseAlphabet(input);
  }

  @Get('longest-word')
  @ApiOperation({ summary: 'Find the longest word in a sentence' })
  @ApiQuery({
    name: 'sentence',
    example: 'Saya sangat senang mengerjakan soal algoritma',
    description: 'Input sentence to find the longest word',
  })
  @ApiResponse({ status: 200, description: 'mengerjakan: 11 character' })
  longestWord(@Query('sentence') sentence: string) {
    return this.algoritmaService.longestWord(sentence);
  }

  @Get('count-occurrences')
  @ApiOperation({ summary: 'Count occurrences of words from QUERY in INPUT' })
  @ApiQuery({
    name: 'input',
    example: ['xc', 'dz', 'bbb', 'dz'],
    isArray: true,
    description: 'Array of input strings',
  })
  @ApiQuery({
    name: 'query',
    example: ['bbb', 'ac', 'dz'],
    isArray: true,
    description: 'Array of query strings',
  })
  @ApiResponse({ status: 200, description: '[1, 0, 2]' })
  countOccurrences(
    @Query('input') input: string[],
    @Query('query') query: string[],
  ) {
    return this.algoritmaService.countOccurrences(input, query);
  }

  @Get('diagonal-difference')
  @ApiOperation({
    summary: 'Calculate difference between the sums of matrix diagonals',
  })
  @ApiQuery({
    name: 'matrix',
    example: '[[1, 2, 0], [4, 5, 6], [7, 8, 9]]',
    description: 'NxN matrix in JSON format',
  })
  @ApiResponse({ status: 200, description: '3' })
  diagonalDifference(@Query('matrix') matrix: string) {
    const parsedMatrix = JSON.parse(matrix);
    return this.algoritmaService.diagonalDifference(parsedMatrix);
  }
}
