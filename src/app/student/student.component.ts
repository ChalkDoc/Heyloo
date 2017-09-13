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
  subStudent;
  studentId;
  allPlayers;
  sortedPlayers = [];
  currentPosition;
  totalPositions;
  previousPosition;
  positionChange;
  positionChangeColor;

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
  }

  ngDoCheck(){
    if(this.subGame['game_state'] == 'question'){
      this.setStartTime();
    }else if(this.subGame['game_state'] == "answer"){
      this.updateGame();
    }else if(this.subGame['game_state'] == 'leaderboard'){
      this.studentService.changeStudentsAnsweredToFalse(this.currentStudent);
      this.previousPosition = this.currentPosition;
    }
  }

  getStudentAnswer(answer: number){
    var questionAnswer;
    this.currentQuestion.student_choices[answer] ++;
    this.questions[this.subGame.current_question] = this.currentQuestion;
    this.hostService.updatePlayerChoice(this.questions, this.subGame);
    this.endTime = new Date().getTime();
    if(answer == this.currentQuestion.answer){
      this.studentService.editStudentPoints(this.currentStudent, true, this.scoringAlgorithm(this.endTime, this.startTime));
    }
    else{
      this.studentService.editStudentPoints(this.currentStudent, false, 0);
    }
  }

  scoringAlgorithm(end, start){
    var dif = (end - start) / 1000
    var score = (-150 * Math.log(30/(-dif + 30))) + 1000
    // var score = (((1 / 2) * Math.log(-(dif-60))) * 500) + 500;
    // console.log(end, start, dif, score);
    return Math.round(score);
  }

  updateGame(){
    this.currentGame.subscribe(data => {
      this.subGame = data;
    })
    this.getLeaderboard();
    this.getLeaderboardChange();
  }

  setStartTime(){
    this.startTime = new Date().getTime();
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
    this.totalPositions = this.sortedPlayers.length;
  }

  getLeaderboardChange() {
    var change;
    if (this.previousPosition == undefined) {
      this.positionChange = 'N/A'
      this.positionChangeColor = ''
    } else {
      change = this.previousPosition - this.currentPosition;
      if ( change > 0) {
        this.positionChange = 'You advanced ' + Math.abs(change) + ' position(s). Good job!';
        this.positionChangeColor = 'green-text'
      } else if ( change < 0 ){
        this.positionChange = 'You dropped ' + Math.abs(change) + ' position(s). Try again next round!';
        this.positionChangeColor = 'red-text'
      } else if ( change == 0 ){
        this.positionChange = 'Your ranking hasn\'t changed.';
        this.positionChangeColor = ''
      }
    }
  }
}
