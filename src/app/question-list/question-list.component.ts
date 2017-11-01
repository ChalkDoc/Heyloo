import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Question, Answer } from '../quiz.interface';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})

// A QuestionListComponent who knows only about an array of questions,
// and is responsible for managing the array, 
// but not the questions within it

export class QuestionListComponent implements OnInit {

  @Input('quizForm')
  public quizForm: FormGroup;

  @Input('questions')
  public questions: Question[];

  nextId: number;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    console.log('Initializing question list', this.questions);
    this.nextId = 1;
    this.quizForm.addControl('questions', new FormArray([]));
    this.addQuestion();
  }

  //_.uniqueId(),
  private getNextId(): number{
    return this.nextId++
  }

  addQuestion() {
    const question: Question = {
        id: this.getNextId(),
        title: 'My Question',
        instructions: 'Instructions here',
        time: 30000,
        answerId: 1,
        answers: []
    };

    for(var i=1;i<=4;i++){
      var a: Answer = {
        id: i,
        data: "Answer #" + i.toString(),
        type: "TEXT"
      }
      question.answers.push(a);
    }
    this.questions.push(question);
    this.cd.detectChanges();
    return false;
  }

  removeQuestion(idx: number) {
    if (this.questions.length > 1) {
      this.questions.splice(idx, 1); // Splice removes just one item from array
      (<FormArray>this.quizForm.get('questions')).removeAt(idx);
    }
    return false;
  }

}
