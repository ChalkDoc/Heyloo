export class Question {
  public player_choices: number[];
  public title: string;
  public instructions: string;
  public time: number;
  public prompt: string;
  public choices: string[];
  public answer: number

  constructor(title: string, instructions: string, time: number, prompt: string, choices: string[], answer: number){
      this.title = title;
      this.instructions = instructions;
      this.time = time;
      this.prompt = prompt;
      this.choices = choices;
      this.answer = answer;
      this.player_choices =[0, 0, 0, 0];
    }
}
