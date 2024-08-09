// src/book/book.controller.ts

import { Controller, Get } from '@nestjs/common';
import { BookService } from './book.service';
import { BookDto } from './book.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly booksService: BookService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'List of books', type: [BookDto] })
  async getAllBooks(): Promise<BookDto[]> {
    return this.booksService.findAll();
  }
}
