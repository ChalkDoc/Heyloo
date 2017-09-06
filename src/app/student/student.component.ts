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
  currentGameKey: string;
  subGame;
  startTime;
  endTime;
  answered: boolean;
  subStudent;
  studentId;
  allPlayers;
  sortedPlayers = [];
  currentPosition;
  totalPositions;
  positionChange;

  constructor(private route: ActivatedRoute, private studentService: StudentService, private router: Router, private hostService: HostService) { }

  ngOnInit() {
    var studentId;
    this.route.params.forEach(urlParameters => {
      this.currentGame = this.hostService.getGameFromCode(urlParameters['roomcode']);
      this.studentId = urlParameters['studentid'];
    })
    this.currentGame.subscribe(data => {
      this.currentGameKey = data['$key'];
      this.currentQuestion = data['question_list'][data['current_question']];
    })
    this.currentStudent = this.studentService.getStudentGameKeyAndId(this.currentGameKey, this.studentId);
    this.questions = this.hostService.getQuestions();
    this.currentGame.subscribe(data => {
      this.subGame = data;
    })
    this.currentStudent.subscribe(data => {
      this.subStudent = data;
    })
    this.answered = false;
    this.startTime = 0;
    this.endTime = 0;
  }

  ngDoCheck(){
    if(this.subGame['game_state'] == "answer"){
      this.updateGame();
      // console.log('subStudent', this.subStudent);
      // console.log('currentStudent', this.currentStudent);
    }else if(this.subGame['game_state'] == 'question'){
      this.setAnsweredToFalse();
      this.setStartTime();
    }else if(this.subGame['game_state'] == 'leaderboard'){
      this.studentService.changeStudentsAnsweredToFalse(this.currentStudent);
    }
  }

  getStudentAnswer(answer: number){
    var questionAnswer;
    this.currentQuestion.student_choices[answer] ++;
    this.questions[this.subGame.current_question] = this.currentQuestion;
    this.hostService.updatePlayerChoice(this.questions, this.subGame);
    this.endTime = new Date().getTime();
    this.answered = true;
    if(answer == this.currentQuestion.answer){
      this.studentService.editStudentPoints(this.currentStudent, true, this.scoringAlgorithm(this.endTime, this.startTime));
    }
    else{
      this.studentService.editStudentPoints(this.currentStudent, false, 0);
    }
    this.startTime = 0;
    this.endTime = 0;
  }

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
    this.getLeaderboard();
    // this.getLeaderboardChange();
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

  getLeaderboard() {
    this.allPlayers = this.studentService.subPlayers;
    this.sortedPlayers = this.allPlayers.slice().sort(function(a, b) {
      return b.points - a.points;
    });
    for (var i = 0; i < this.sortedPlayers.length; i++) {
      if (this.sortedPlayers[i].id == this.subStudent.id) {
        this.currentPosition = i+1;
      }
    }
    this.totalPositions = this.sortedPlayers.length
  }

  // getLeaderboardChange() {
  //   var playersArray = [];
  //   var previousPosition;
  //   var change;
  //   for (var i = 0; i < this.sortedPlayers.length; i++) {
  //     var playerObject = {id: this.sortedPlayers[i].id, previousPoints: this.sortedPlayers[i].points - this.sortedPlayers[i].questionPoints}
  //     playersArray.push(playerObject);
  //   }
  //   playersArray.sort(function(a, b) {
  //     return b.previousPoints - a.previousPoints;
  //   })
  //   for (var i = 0; i < playersArray.length; i++) {
  //     if (playersArray[i].id == this.subStudent.id) {
  //       previousPosition = i+1;
  //     }
  //   }
  //   change = this.currentPosition - previousPosition;
  //   if (change > 0) {
  //     this.positionChange = '+' + change;
  //   } else {
  //     this.positionChange = change;
  //   }
  // }

}
