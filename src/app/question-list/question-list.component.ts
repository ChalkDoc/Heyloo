import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Question } from '../quiz.interface';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {

  @Input('quizForm')
  public quizForm: FormGroup;

  @Input('questions')
  public questions: Question[];

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    console.log('Initializing quistion list', this.questions);
    this.quizForm.addControl('questions', new FormArray([]));
  }

  addQuestion() {
    const question: Question = {
        id: Math.floor(Math.random() * 100),
        title: 'My Question',
        instructions: 'Instructions here',
        time: 30000,
        answerId: 1
    };

    this.questions.push(question);
    this.cd.detectChanges();
    return false;
  }

  removeChild(idx: number) {
      if (this.questions.length > 1) {
          this.questions.splice(idx, 1);
          (<FormArray>this.quizForm.get('questions')).removeAt(idx);
      }
      return false;
  }
}
