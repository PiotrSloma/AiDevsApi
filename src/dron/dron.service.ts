import { Injectable } from '@nestjs/common';
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export class DronService {
  position: { x: number; y: number } = { x: 0, y: 0 };
  constructor(private readonly openaiService: OpenaiService) {}

  async getPosition() {
    return this.position;
  }

  async move(direction: 'up' | 'down' | 'left' | 'right', quantity = 1) {
    switch (direction) {
      case 'up':
        this.position.y -= quantity;
        break;
      case 'down':
        this.position.y += quantity;
        break;
      case 'left':
        this.position.x -= quantity;
        break;
      case 'right':
        this.position.x += quantity;
        break;
    }
  }
}
