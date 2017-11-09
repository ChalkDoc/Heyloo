import { Player } from './player.model';
import { Question } from './question.model';
export class Game {
  current_question: number
  constructor(public id: number, public game_state: string, public game_over: boolean, public player_list: Player[], public question_list: Question[], public questions_remaining: number){
      this.current_question = 0;
  }
}
