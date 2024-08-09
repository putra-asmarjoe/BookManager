import { Controller, Get } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberDto } from './member.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('members')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({
    status: 200,
    description: 'List of members',
    type: [MemberDto],
  })
  getAllMembers() {
    return this.memberService.findAll();
  }
}
