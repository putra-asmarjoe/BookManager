import { ApiProperty } from '@nestjs/swagger';

export class BorrowDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  memberId: number;

  @ApiProperty()
  bookId: number;

  @ApiProperty()
  borrowDate: Date;

  @ApiProperty({ required: false })
  returnDate?: Date;

  @ApiProperty({ required: false })
  isLate: boolean;
}

export class CreateBorrowDto {
  @ApiProperty()
  memberId: number;

  @ApiProperty()
  bookId: number;

  @ApiProperty({ required: true })
  borrowDate?: Date;
}

export class UpdateBorrowDto {
  @ApiProperty({ required: false })
  returnDate?: Date;
}
