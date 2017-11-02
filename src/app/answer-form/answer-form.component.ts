import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Answer } from '../quiz.interface';

@Component({
  selector: 'app-answer-form',
  templateUrl: './answer-form.component.html',
  styleUrls: ['./answer-form.component.css']
})
export class AnswerFormComponent implements OnInit {

  @Input('answers')
  public answers: FormArray;

  @Input('answer')
  public answer: Answer;

  public answerForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    console.log('Initializing Answer form. its data =', this.answer.data);
    this.answerForm = this.toFormGroup(this.answer);
    // this.answers.push(this.answerForm);
  }

  private toFormGroup(data: Answer) {
    const formGroup = this.fb.group({
        id: [ data.id ],
        data: [ data.data || '', Validators.required ],
        type: [ data.type || 'TEXT', Validators.required ]
    });

    return formGroup;
  }
}
