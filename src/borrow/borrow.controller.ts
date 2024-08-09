import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto, UpdateBorrowDto, BorrowDto } from './borrow.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('borrows')
@Controller('borrows')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Get()
  @ApiOperation({ summary: 'Get all borrow records' })
  @ApiResponse({
    status: 200,
    description: 'List of borrow records',
    type: [BorrowDto],
  })
  getAllBorrows() {
    return this.borrowService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a borrow record by ID' })
  @ApiResponse({
    status: 200,
    description: 'The borrow record',
    type: BorrowDto,
  })
  getBorrow(@Param('id') id: number) {
    return this.borrowService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new borrow record' })
  @ApiResponse({
    status: 201,
    description: 'The created borrow record',
    type: BorrowDto,
  })
  create(@Body() createBorrowDto: CreateBorrowDto) {
    return this.borrowService.create(createBorrowDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a borrow record' })
  @ApiResponse({
    status: 200,
    description: 'The updated borrow record',
    type: BorrowDto,
  })
  update(@Param('id') id: number, @Body() updateBorrowDto: UpdateBorrowDto) {
    return this.borrowService.update(id, updateBorrowDto);
  }
}
