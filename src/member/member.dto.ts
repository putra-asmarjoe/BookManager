import { IsString, IsInt, IsOptional, IsDate } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class MemberDto {
  @ApiProperty({ example: 'M001', description: 'The unique code of the member' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Angga', description: 'The name of the member' })
  @IsString()
  name: string;

  @ApiProperty({ example: 0, description: 'The penalty points of the member' })
  @IsInt()
  @IsOptional()
  penalty?: number;

  @ApiProperty({ example: '2024-08-08T00:00:00Z', description: 'The end date of the penalty' })
  @IsDate()
  @IsOptional()
  penaltyEndDate?: Date;
}

export class CreateMemberDto extends MemberDto {}

export class UpdateMemberDto extends PartialType(MemberDto) {}
