import { DynamicModule, Module, Global } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import OpenAI from 'openai';

@Global()
@Module({
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {
  static forRoot(config: { apiKey: string }): DynamicModule {
    const openaiProvider = {
      provide: 'OPENAI_CLIENT',
      useValue: new OpenAI(config),
    };

    return {
      module: OpenaiModule,
      providers: [openaiProvider, OpenaiService],
      exports: [OpenaiService, 'OPENAI_CLIENT'],
      global: true,
    };
  }
}
