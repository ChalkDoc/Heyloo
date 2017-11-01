import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Quiz } from '../quiz.interface';
import * as _ from 'lodash';

@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.css']
})

// Beautiful Instructions at: http://brophy.org/post/nested-reactive-forms-in-angular2/
// and https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2

// A QuizFormComponent who knows only about root level 
// Quiz fields and how to prompt for them in inputs, 
// and nothing about questions or answers

export class QuizFormComponent implements OnInit {
  public initialQuiz: Quiz;
  public myQuiz: Quiz;
  public quizForm: FormGroup; // our form model

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // we will initialize our form here
    this.initialQuiz = this.getQuiz();
    this.myQuiz = _.cloneDeep(this.initialQuiz);
    this.quizForm = this.toFormGroup(this.myQuiz);
    console.log('Initial myQuiz', this.myQuiz);
  }

  // This fires whenever something changes in the form
  ngAfterViewInit() {
    this.quizForm.valueChanges
        .subscribe(value => {
            console.log('Parent Form changed', value);
            this.myQuiz = _.mergeWith(this.myQuiz,
                                          value,
                                          this.mergeCustomizer);

        });
}

  private getQuiz(): Quiz {
        // creating a default Quiz
        return {
          name:"My Quiz",
          questions: []
        } 
  }

  private toFormGroup(data: Quiz): FormGroup {
    const formGroup = this.fb.group({
        name: [ data.name, Validators.required ]
    });

    return formGroup;
  }

  // _.mergeWith customizer to avoid merging primitive arrays, and only
  // merge object arrays
  private mergeCustomizer = (objValue, srcValue) => {
    if (_.isArray(objValue)) {
        if (_.isPlainObject(objValue[0]) || _.isPlainObject(srcValue[0])) {
            return srcValue.map(src => {
                const obj = _.find(objValue, { id: src.id }); // you cannot alter the ID in the form
                return _.mergeWith(obj || {}, src, this.mergeCustomizer);
            });
        }
        return srcValue;
    }
  }

  onSubmit() {
    if (!this.quizForm.valid) {
        console.error('Parent Form invalid, preventing submission');
        return false;
    }

    const updatedQuiz = _.mergeWith(this.myQuiz,
                                          this.quizForm.value,
                                          this.mergeCustomizer);

    console.log('Submitting...');
    console.log('Original quiz', this.initialQuiz);
    console.log('Updated parentData', updatedQuiz);

    return false;
}


} // End of class