import { Module } from '@nestjs/common';
import { DronService } from './dron.service';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [OpenaiModule],
  providers: [DronService],
  exports: [DronService],
})
export class DronModule {}
