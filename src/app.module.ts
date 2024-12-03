import { Module } from '@nestjs/common';
import { OpenaiModule } from './openai/openai.module';
import { AiDevsModule } from './ai-devs/ai-devs.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    OpenaiModule.forRoot({
      apiKey: process.env.OPENAI_API_KEY,
    }),
    AiDevsModule,
  ],
})
export class AppModule {}
