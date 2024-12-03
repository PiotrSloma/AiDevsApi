import { Module } from '@nestjs/common';
import { OpenaiModule } from './openai/openai.module';
import { AiDevsModule } from './ai-devs/ai-devs.module';
import { ConfigModule } from '@nestjs/config';
import { DronModule } from './dron/dron.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OpenaiModule.forRoot({
      apiKey: process.env.OPENAI_API_KEY,
    }),
    AiDevsModule,
    DronModule,
  ],
})
export class AppModule {}
