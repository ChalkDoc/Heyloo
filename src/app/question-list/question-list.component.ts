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

  constructor(private cd: ChangeDetectorRef) {
    this.questions = [];
   }

  // <previous> 1. Create FormGroup quizForm
  // <previous> 2. Add Quiz controls to FormGroup (via toFormGroup)
  // 3. Add questions FormArray to FormGroup
  // 4. Add first Question to questions FormArray

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
    let question: Question = {
        id: this.getNextId(),
        title: 'My test',
        instructions: 'Instructions here',
        time: 30000,
        answerId: 1,
        answers: []
    };

    for(var i=1;i<=4;i++){
      const a: Answer = {
        id: i,
        data: "Answer #" + i.toString(),
        type: "TEXT"
      }
      question.answers.push(a);
    }
    console.log("question equals=" + question);
    console.log("question answer 2 data = " + question.answers[1].data);
    
    this.questions.push(question);
   // console.log("checking questions question answer 2 data = " + this.questions[1].answers[1].data);
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
