import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Player } from '../player.model';
import { Game } from '../game.model';
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
  subGame;
  startTime;
  endTime;
  answered: boolean;
  subStudent;
  studentId;


  constructor(private route: ActivatedRoute, private studentService: StudentService, private router: Router, private hostService: HostService) { }

  ngOnInit() {
    var currentGameKey;
    var studentId;
    this.route.params.forEach(urlParameters => {
      this.currentGame = this.hostService.getGameFromCode(urlParameters['roomcode']);
      this.studentId = urlParameters['studentid'];
    })
    this.currentGame.subscribe(data => {
      currentGameKey = data['$key'];
      this.currentQuestion = data['question_list'][data['current_question']];
    })
    this.currentStudent = this.studentService.getStudentGameKeyAndId(currentGameKey, this.studentId);
    this.questions = this.hostService.getQuestions();
    this.currentGame.subscribe(data => {
      this.subGame = data;
    })
    this.answered = false;
    this.startTime = 0;
    this.endTime = 0;
  }

  ngDoCheck(){
    if(this.subGame['game_state'] == "answer"){
      // console.log('game state now answer')
      this.updateGame();
    }else if(this.subGame['game_state'] == 'question'){
      // console.log('game state now question')
      this.setAnsweredToFalse();
      this.setStartTime();
    }
  }

  getStudentAnswer(answer: number){
    var questionAnswer;
    this.currentQuestion.student_choices[answer] ++;
    this.questions[this.subGame.current_question] = this.currentQuestion;
    this.hostService.updatePlayerChoice(this.questions, this.subGame);
    this.endTime = new Date().getTime();
    this.answered = true;
    // console.log(this.answered, "set answered to true");
    //David's code
    console.log(Object.keys(this.subGame.player_list),"inside getStudentAnswer()")
    for(let i=0;i<Object.keys(this.subGame.player_list).length;i++){
      console.log(this.subGame.player_list[0]);
      console.log(this.studentId);
      if(this.subGame.player_list[i].id==this.studentId){
        this.subGame.player_list[i].answered=true;
      }
    }
    //David's Code
    if(answer == this.currentQuestion.answer){
      this.studentService.editStudentPoints(this.currentStudent, true, this.scoringAlgorithm(this.endTime, this.startTime));
    }
    else{
      this.studentService.editStudentPoints(this.currentStudent, false, 0);
    }
    this.startTime = 0;
    this.endTime = 0;
  }

  // checkAllAnswered(){
  //   for(let i=0;i<this.studentService.subPlayers.length;i++){
  //     if(this.studentService.subPlayers){
  //
  //     }
  //   }
  //
  // }

  scoringAlgorithm(end, start){
    var dif = (end - start) / 1000
    var score = (-150 * Math.log(30/(-dif + 30))) + 1000
    // var score = (((1 / 2) * Math.log(-(dif-60))) * 500) + 500;
    // console.log(end, start, dif, score);
    return score;
  }

  updateGame(){
    this.currentGame.subscribe(data => {
      this.subGame = data;
    })
  }

  setAnsweredToFalse(){
    if(this.endTime == 0){
      this.answered = false;
    }
  }

  setStartTime(){
    if (this.startTime == 0){
      this.startTime = new Date().getTime();
    }
  }
}
