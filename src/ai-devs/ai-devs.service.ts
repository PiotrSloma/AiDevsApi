import { Injectable } from '@nestjs/common';
import { DronService } from 'src/dron/dron.service';
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export class AiDevsService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly dronService: DronService,
  ) {}

  async start() {
    const body = {
      apikey: process.env.AGENTS_API_KEY,
      answer: process.env.HOST_URL + '/api/ai-devs/common',
      task: 'webhook',
    };
    const response = await fetch('https://centrala.ag3nts.org/report', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const responseBody = await response.json();
    console.log(responseBody);
    return responseBody;
  }

  async common(instruction: string) {
    console.log(instruction);
    const position = await this.dronService.getPosition();
    const result = await this.openaiService.generateCompletion(
      instruction,
      `
      Twoim zadaniem jest określić w którą kierunku rusza się dron.
      Użytkownik poda Ci instrukcję, na podstawie której musisz określić kierunek ruchu drona.
      <rules>
      - Odpowiedz w formacie JSON
      - <map> to mapa pola, na którym się znajdujesz
      - <position> to aktualne położenie drona
      - W odpowiedzi musisz zwrócić kierunek ruchu drona i ilość pól, o które się porusza w daną stronę
      - Nie podawaj od razu odpowiedzi, najpierw przemyśl jakąś strategię
      </rules>
      
      <map>
      (0,0) (0,1) (0,2) (0,3)
      (1,0) (1,1) (1,2) (1,3)
      (2,0) (2,1) (2,2) (2,3)
      (3,0) (3,1) (3,2) (3,3)
      </map>

      <position>
      (${position.x},${position.y})
      </position>

      <json_schema>
      {
        "_thinking": string, - opis działania, skąd wziąłeś wynik
        "moves": [{"direction": "up" | "down" | "left" | "right", "quantity": number}] - lista ruchów drona
      }
      </json_schema>
      `,
      'gpt-4o',
      { response_format: { type: 'json_object' } },
    );
    console.log(result);

    const moves = JSON.parse(result).moves;
    for (const move of moves) {
      await this.dronService.move(move.direction, move.quantity);
    }
    const newPosition = await this.dronService.getPosition();
    const description = await this.getPosition(newPosition);
    console.log(description);
    return { description, newPosition };
  }

  async getPosition(position: { x: number; y: number }) {
    return this.openaiService.generateCompletion(
      `What is the position of the point ${JSON.stringify(position)}?`,
      `Jesteś pilotem drona. Twoim zadaniem jest opisanie położenia drona względem punktu startowego (0, 0).
      
      <rules>
      - Odpowiedz w formacie JSON
      - Odpowiedz w języku polskim
      - <map> to mapa pola, na którym się znajdujesz
      - <map_desc> to opis poszczególnych pól
      - W answer opisz pole na jakim się znajdujesz używając <map_desc>
      </rules>

      <map>
      (0,0) (0,1) (0,2) (0,3)
      (1,0) (1,1) (1,2) (1,3)
      (2,0) (2,1) (2,2) (2,3)
      (3,0) (3,1) (3,2) (3,3)
      </map>

      <map_desc>
      (0,0) - START
      (0,1),(1,0),(1,2),(1,3),(2,0),(2,1) - trawa, łaka, pole 
      (0,2) - jedno drzewo i trawa, łąka, pole
      (2,4) - dwa drzewa i trawa, łąka, pole
      (1,1) - młyn i trawa, łąka, pole
      (2,2) - kamienie
      (3,0),(3,1) - góry
      (3,2) - samochód
      (3,3) - jaskinia w górach
      </map_desc>

      <json_schema>
      {
        "_thinking": string, - opis działania, skąd wziąłeś wynik
        "description": string, - odpowiedz na jakim polu się znajdujesz odpowiadając np "Lecę nad młynem","Jestem nad polem z kamieniami"
        "x": number, - położenie x
        "y": number - położenie y
      }
      </json_schema>
      `,
      'gpt-4o',
      { response_format: { type: 'json_object' } },
    );
  }
}
