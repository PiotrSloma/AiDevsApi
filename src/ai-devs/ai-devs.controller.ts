import { Controller, Post, Body } from '@nestjs/common';
import { AiDevsService } from './ai-devs.service';

@Controller('ai-devs')
export class AiDevsController {
  constructor(private readonly aiDevsService: AiDevsService) {}

  @Post('chat')
  async chat(@Body() body: { prompt: string }) {
    return this.aiDevsService.generateCompletion(body.prompt);
  }
}
