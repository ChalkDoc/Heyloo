export class Player {
  public ratio: number = 0;
  public points: number = 0;
  public questionPoints: number = 0;

  constructor(public name: string, public correct: number, public wrong: number, public id: number, public answered: boolean, public key?: string){

    if(correct != 0 && wrong != 0){
      this.ratio = (correct/wrong);
    }
    else if(correct > 0 && wrong === 0){
      this.ratio = 1;
    }
    else {
      this.ratio = 0;
    }
  }
}
