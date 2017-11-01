import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Question } from '../quiz.interface';

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
    console.log('Initializing quistion list', this.questions);
    this.nextId = 2;
    this.quizForm.addControl('questions', new FormArray([]));
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
        answerId: 1
    };

    this.questions.push(question);
    this.cd.detectChanges();
    return false;
  }

  removeQuestion(idx: number) {
    (<FormArray>this.quizForm.get('questions')).removeAt(idx);
    // So you cannot delete the last question  
    if (this.questions.length > 1) {
          (<FormArray>this.quizForm.get('questions')).removeAt(idx);
      }
      return false;
  }

}
