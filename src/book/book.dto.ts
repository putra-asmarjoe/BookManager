import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// Base DTO for book
export class BookDto {
  @ApiProperty({ example: 1, description: 'The unique ID of the book' })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'JK-45', description: 'The unique code of the book' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Harry Potter', description: 'The title of the book' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'J.K Rowling', description: 'The author of the book' })
  @IsString()
  author: string;

  @ApiProperty({ example: 1, description: 'The number of copies of the book in stock' })
  @IsInt()
  @Min(0)
  stock: number;
}

// DTO for creating a book without the ID
export class CreateBookDto {
  @ApiProperty({ example: 'JK-45', description: 'The unique code of the book' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Harry Potter', description: 'The title of the book' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'J.K Rowling', description: 'The author of the book' })
  @IsString()
  author: string;

  @ApiProperty({ example: 1, description: 'The number of copies of the book in stock' })
  @IsInt()
  @Min(0)
  stock: number;
}



// DTO for creating a book without the ID
export class NemoBookDto {
    @ApiProperty({ example: 'JK-45', description: 'The unique code of the book' })
    @IsString()
    code: string;
  
    @ApiProperty({ example: 'Harry Potter', description: 'The title of the book' })
    @IsString()
    title: string;
  
    @ApiProperty({ example: 'J.K Rowling', description: 'The author of the book' })
    @IsString()
    author: string;
  
    @ApiProperty({ example: 1, description: 'The number of copies of the book in stock' })
    @IsInt()
    @Min(0)
    stock: number;
  }

// DTO for updating a book, all fields optional
export class UpdateBookDto extends PartialType(CreateBookDto) {}
