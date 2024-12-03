import { Injectable } from '@nestjs/common';
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export class AiDevsService {
  constructor(private readonly openaiService: OpenaiService) {}

  async generateCompletion(prompt: string) {
    return this.openaiService.generateCompletion(
      prompt,
      'You are a helpful assistant.',
    );
  }
}
