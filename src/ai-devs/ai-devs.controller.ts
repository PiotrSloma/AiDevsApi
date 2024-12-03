import { Controller, Post, Body } from '@nestjs/common';
import { AiDevsService } from './ai-devs.service';

@Controller('ai-devs')
export class AiDevsController {
  constructor(private readonly aiDevsService: AiDevsService) {}

  @Post('common')
  async common(@Body() body: { instruction: string }) {
    console.log(body);
    return this.aiDevsService.common(body.instruction);
  }
  @Post('start')
  async start() {
    return this.aiDevsService.start();
  }
}
