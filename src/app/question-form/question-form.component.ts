import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Question } from '../quiz.interface';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {

  @Input('questions')
  public questions: FormArray;

  @Input('question')
  question: Question;

  public questionForm: FormGroup;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    console.log('Initializing Question form', this.question);
    this.questionForm = this.toFormGroup(this.question);
    this.questions.push(this.questionForm);
    // this.questionForm.addControl('answers', new FormArray([]));
    console.log("did the answers survive?" + this.question.answers[0].data)
    
    //Strange bug but I cannot name this control 'answers' or it breaks
    this.questionForm.addControl('answ', new FormArray([]));
    console.log('hello there');
    console.log("did the answers survive part 2?" + this.question.answers[0].data)
    console.log('...and gooodbye');
    //this.cd.detectChanges();
  }

  private toFormGroup(data: Question) {
    const formGroup = this.fb.group({
        id: [ data.id ],
        title: [ data.title || '', Validators.required ],
        instructions: [ data.instructions || '', Validators.required ],
        time: [ data.time || 30, Validators.required ],
        answerId: [ data.answerId || 1, Validators.required ]
    });

    return formGroup;
  }
}
