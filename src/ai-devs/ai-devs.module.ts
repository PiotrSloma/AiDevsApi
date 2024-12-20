import { Module } from '@nestjs/common';
import { AiDevsService } from './ai-devs.service';
import { AiDevsController } from './ai-devs.controller';
import { OpenaiModule } from 'src/openai/openai.module';
import { DronModule } from 'src/dron/dron.module';

@Module({
  providers: [AiDevsService],
  controllers: [AiDevsController],
  imports: [OpenaiModule, DronModule],
})
export class AiDevsModule {}
