import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Player } from '../player.model';
import { Question } from '../question.model';
import { StudentService } from '../student.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { HostService } from '../host.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  providers: [StudentService, HostService]
})
export class StudentComponent implements OnInit {
  currentGame: FirebaseObjectObservable<any[]>;
  currentStudent: FirebaseObjectObservable<any[]>;
  questions: Question[];
  currentQuestion: Question;

  constructor(private route: ActivatedRoute, private studentService: StudentService, private router: Router, private hostService: HostService) { }

  ngOnInit() {
    console.log('init')
    var currentGameKey;
    var studentId;
    this.route.params.forEach(urlParameters => {
      this.currentGame = this.hostService.getGameFromCode(urlParameters['roomcode']);
      studentId = urlParameters['studentid'];
    })
    console.log(this.currentGame);
    this.currentGame.subscribe(data => {
      currentGameKey = data['$key'];
      this.currentQuestion = data['question_list'][data['current_question']];
    })
    this.currentStudent = this.studentService.getStudentGameKeyAndId(currentGameKey, studentId);
    console.log();
    this.questions = this.hostService.getQuestions();
    console.log(this.currentStudent);
  }

  getStudentAnswer(answer: number){
    var questionAnswer;
    console.log(this.currentStudent);
    if(answer == this.currentQuestion.answer){
      console.log(this.currentStudent);
      this.studentService.editStudentPoints(this.currentStudent, this.currentGame, true);
    }
    else{
      this.studentService.editStudentPoints(this.currentStudent, this.currentGame, false);
    }
  }
}


// this.route.params.forEach((urlParameters) => {
//   this.studentId = urlParameters['id'];
//     });
//      this.studentService.getStudent(this.studentId).subscribe(dataLastEmittedFromObserver => {
//     //  this.studentToDisplay = new Player
//      (dataLastEmittedFromObserver.name,
//      dataLastEmittedFromObserver.correct,
//      dataLastEmittedFromObserver.wrong)
//    })
//    this.students = this.studentService.getStudents();

//https://stackoverflow.com/questions/36320821/passing-multiple-route-params-in-angular2     HOW TO USE MULTIPLE ROUTER PARAMS
