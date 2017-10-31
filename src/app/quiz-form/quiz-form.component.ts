import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Quiz, Question, Answer, AnswerType } from '../quiz.interface';

@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.css']
})
export class QuizFormComponent implements OnInit {
  public initialQuiz: Quiz;
  public myQuiz: Quiz;
  public myForm: FormGroup; // our form model

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    // we will initialize our form here
    this.myForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      questions: this._fb.array([
          this.initQuestion(),
      ])
    });
  }

  private getQuiz(): Quiz {
        // initialize a Quiz
        return {
          name:"My Quiz",
          questions: [{
            id: 1,
            title: "Question 1",
            instructions: "Instructions go here",
            time: 30000,
            answerId: 1,
            answers: [{
              id:1,
              data:"Answer #1",
              type:"text"
            },{
              id:2,
              data:"Answer #2",
              type:"text"
            },{
              id:3,
              data:"Answer #3",
              type:"text"
            },{
              id:4,
              data:"Answer #4",
              type:"text"
            }]
          }]
        } 
  }

  initQuestion() {
    // initialize a question
    return this._fb.group({
      title: ['', Validators.required],
      instructions: ['', Validators.required],
      time: ['', Validators.required],
      answerIndex: ['', Validators.required],
      answers: this._fb.array([
        this.initAnswer(),
        this.initAnswer(),
        this.initAnswer(),
        this.initAnswer()      
      ])
    });
  }

  addQuestion() {
    // add question to the list of questions
    const control = <FormArray>this.myForm.controls['questions'];
    control.push(this.initQuestion());
  }
    
  removeQuestion(i: number) {
    // remove question from the list
    const control = <FormArray>this.myForm.controls['questions'];
    control.removeAt(i);
  }

  initAnswer() {
    // initialize an answer
    return this._fb.group({
      title: ['', Validators.required],
      instructions: ['', Validators.required],
      time: ['', Validators.required],
      answerIndex: ['', Validators.required],
      answers: this._fb.array([
        this.initAnswer(),
        this.initAnswer(),
        this.initAnswer(),
        this.initAnswer()      
      ])
    });
  }
  
  addAnswer() {
    // add question to the list of questions
    const control = <FormArray>this.myForm.controls['answers'];
    control.push(this.initAnswer());
  }
    
  removeAnswer(i: number) {
    // remove question from the list
    const control = <FormArray>this.myForm.controls['answers'];
    control.removeAt(i);
  }


  save(model: Quiz) {
    // call API to save customer
    console.log(model);
  } 

} // End of class

// Beautiful Instructions at: http://brophy.org/post/nested-reactive-forms-in-angular2/
// and https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2

