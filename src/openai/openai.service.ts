import { Injectable, Inject } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  constructor(
    @Inject('OPENAI_CLIENT')
    private readonly openaiClient: OpenAI,
  ) {}

  async generateCompletion(
    prompt: string,
    systemPrompt: string,
    model = 'gpt-4o',
    options?: any,
  ) {
    try {
      const completion = await this.openaiClient.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        model,
        ...options,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  async generateImage(prompt: string) {
    try {
      const response = await this.openaiClient.images.generate({
        prompt,
        n: 1,
        size: '1024x1024',
      });

      return response.data[0].url;
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}
