import { Module } from '@nestjs/common';
import { AlgoritmaController } from './algoritma.controller';
import { AlgoritmaService } from './algoritma.service';

@Module({
  controllers: [AlgoritmaController],
  providers: [AlgoritmaService]
})
export class AlgoritmaModule {}
