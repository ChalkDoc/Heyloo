export interface Quiz {
  name: string;
  questions: Question[];
}

export interface Question {
  id: number;
  title: string;
  instructions: string;  
  time: number;  // The number of Milliseconds the question will be shown
  answerId: number; //the array id of the correct answer
  //  answers: Answer[];
}

export interface Answer {
  id: number;
  data: string;
  type: string; // to be enum AnswerType in the future
}

// export enum AnswerType {
//   url = "URL",
//   text = "TEXT"
// }
