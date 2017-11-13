import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Player } from '../player.model';
import { Game } from '../game.model';
import { Question } from '../question.model';
import { StudentService } from '../student.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { HostService } from '../host.service';
import { Observable } from 'rxjs/Observable'; //Added by STZ

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  providers: [StudentService, HostService]
})
export class StudentComponent implements OnInit {
  
  questions: Question[];
  currentGameKey: string;

  // this is the data from our current game, as a json object
  subGame;

  startTime;
  endTime;
  subStudent;
  allPlayers;
  sortedPlayers = [];
  currentPosition;
  totalPositions;
  previousPosition;
  positionChange;
  positionChangeColor;

  // STZ Variables
  urlParamRoomCode: number;
  urlParamStudentId: number;
  currentGame: Game;
  currentQuestion: Question; 
  currentStudent: Player;
  playersList: Player[];

  constructor(private route: ActivatedRoute, private studentService: StudentService, private router: Router, private hostService: HostService) { }

  ngOnInit() {
    
    // Get the parameters from the URL
    this.route.params.forEach(urlParameters => {
      this.urlParamRoomCode = parseInt(urlParameters['roomcode']);
      this.urlParamStudentId = parseInt(urlParameters['studentid']);
    })

    //Subscribe to game from roomcode
    this.hostService.getGame(this.urlParamRoomCode)
    .subscribe(gameReturned => {
      if(gameReturned.length==1){
        this.currentGame = gameReturned[0];
        this.currentGame.key = gameReturned[0].$key; // Get's the key for this game
        this.currentQuestion = this.currentGame.question_list[this.currentGame.current_question];
        this.playersList = gameReturned[0].player_list;

        // this.iteratePlayers();
        this.printGame();

        // for(let i=0; i<=gameReturned[0].player_list.length;i++){
        //   console.log("the key is: " + gameReturned[0][i].$key);
        //   console.log("Full player is: " +gameReturned[0][i]);
        // }

      } else {
        alert("Room Code is not valid");        
      }
    }, err => {
      alert("Houston we have a problem");
    });

    // Subscribe a student.  Unfortunately this can fire BEFORE previous subscribe returns :(
    // this.studentService
    //   .getStudentFromRoomCodeAndId('-Kycdu7DG-239m8fRxKm', this.urlParamStudentId)
    //   .subscribe(students => {
    //     console.log(students)
    // })
  


    // OLD - Subscribe a student
      // this.currentStudent = this.studentService
      // .getStudentGameKeyAndId(this.currentGame.key, this.urlParamRoomCode);


    // this.questions = this.hostService.getQuestions();

    // this.currentStudent.subscribe(data => {
    //   this.subStudent = data;
    // })

  }

  iteratePlayers(){
    this.playersList.forEach(player => {
      console.log(player.name);
    })
  }

  printGame(){
    console.log(this.currentGame);
  }

  ngDoCheck(){
    if(this.currentGame.game_state == 'question'){
      this.setStartTime();
    }else if(this.currentGame.game_state == "answer"){
      this.updateGame();
    }else if(this.currentGame.game_state == 'leaderboard'){

      this.studentService.changeStudentsAnsweredToFalse(this.currentStudent);
      this.previousPosition = this.currentPosition;
      // Set to null as a method to set Start time only once per question
      this.startTime = null;
      console.log("Question timer was reset to ZERO");
    }
  }

  // Old version
  // ngDoCheck(){
  //   if(this.subGame['game_state'] == 'question'){
  //     this.setStartTime();
  //   }else if(this.subGame['game_state'] == "answer"){
  //     this.updateGame();
  //   }else if(this.subGame['game_state'] == 'leaderboard'){

  //     this.studentService.changeStudentsAnsweredToFalse(this.currentStudent);
  //     this.previousPosition = this.currentPosition;
  //     // Set to null as a method to set Start time only once per question
  //     this.startTime = null;
  //     console.log("Question timer was reset to ZERO");
  //   }
  // }

  getStudentAnswer(answer: number){
    var questionAnswer;

    //This is getting rid of the 0 index, and
    // storing users choice as 1 - 4
    this.currentQuestion.student_choices[answer] ++;

    // a local copy of the current question, stored in an array.
    // not sure this line is needed
    this.questions[this.subGame.current_question] = this.currentQuestion;

    // Send answer to DB
    this.hostService.updatePlayerChoice(this.questions);

    this.setEndTime();

    if(answer == this.currentQuestion.answer){
      this.studentService.editStudentPoints(this.currentStudent, true, this.scoringAlgorithm(this.endTime, this.startTime));
    }
    else{
      this.studentService.editStudentPoints(this.currentStudent, false, 0);
    }
  }

  // number of milliseconds
  // This is hard-coded to 30 seconds responses
  // 1000 maximum score, 500 minimum score
  // End-start returns a number of milliseconds (eg 2472 ms)
  // Dividing by 1000 gives us a elapsed time for the question in seconds (eg 2 sec)
  // Divided by currentQuestion.time (20') gives us a percentage moving (eg .1)

  // TODO: Add Unit tests here

  scoringAlgorithm(end, start){
    return Math.round(1000 * (1 - ((((end - start) / 1000)/this.currentQuestion.time)/2)));
  }

  updateGame(){
    // this.currentGame.subscribe(data => {
    //   this.subGame = data;
    // })
    this.getLeaderboard();
    this.getLeaderboardChange();
  }

  setStartTime(){
        
    if (this.startTime==null){
      this.startTime = new Date().getTime();
      console.log("Time started at = " + this.startTime.toString());
    } else {
      console.log("Attempt to restart clock...CHEATER. DENIED");
    }
  }

  setEndTime(){
    // Register when they submitted an answer
    this.endTime = new Date().getTime();
    console.log("End time = " + this.endTime.toString());
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
