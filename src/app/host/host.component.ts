import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgSwitch } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { HostService} from '../host.service';
import { Question } from '../question.model';
import { Game } from '../game.model';
import { Player } from '../player.model';
import { StudentService } from '../student.service';

@Component({
  selector: 'host-component',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
  providers: [HostService,StudentService]
})

export class HostComponent {

  //games: FirebaseListObservable<any[]>;
  //currentGame: FirebaseObjectObservable<Game>;
  //gameObserver;
    
  //public currentGame; //What type of variable is this?
  currentQuestion: Question;
  
  topPlayers;
  private showQuestion = false;
  private hideBarGraph = true;
  currentQuestionSubstring;
  currentTab: string = "chart";

  //STZ Variables
  gameKey: string;
  games: Game[];
  urlParamRoomCode: number;
  currentGame: Game;
  playersList: Player[]; 
  questions: Question[];
  time: number = 0;  // Timer variable shown on screen, in mulitple places
  interval; // Timer variable 

  // Game Process Constants
  PreQuestionCountdownLengthInSeconds = 10;
  questionReviewCountdownLengthInSeconds = 5;

  constructor(private route: ActivatedRoute, private hostService: HostService, private studentService:StudentService, private router: Router, private location: Location) {
  }

  ngOnInit() {

    console.log('ngInit Fired');

    // Get the ID for the game we're about to host from the URL
    // Need to make sure to parseInt and numbers 
    // as params are returned as strings 
    this.route.params.forEach((urlParameters) => {
      this.urlParamRoomCode = parseInt(urlParameters["roomCode"]);
      console.log("Room code is: " + this.urlParamRoomCode);      
    });

    // All this just to get the gameKey
    this.hostService.getGameAndKey(this.urlParamRoomCode)
      .first()
      .subscribe(gameReturned => {
        if(gameReturned.length==1){
          this.gameKey = gameReturned[0].$key; // Get's the key for this game   

          // Step #2, retrieve full game
          this.getGame(this.gameKey);
          
        } else {
          alert("Room Code " + this.urlParamRoomCode + " is not valid");        
        }
      }, err => {
        alert("Houston we have a problem");
      });

    // Subscribe to a Players list
    this.hostService.getPlayersList(this.urlParamRoomCode)
      .subscribe(players => {
        this.playersList = players;
        console.log("player joined the game");
      }, err => {
        console.log("We got an error, getting the list of players")
      });

  }

  setTab(tab:string){
    this.currentTab=tab;
  }

  // Get a subscription to the game Observable
  getGame(key: string){
    this.hostService.getGameByKey(key)
      .subscribe(game => {
        this.currentGame = game;
        this.questions = game.question_list;
        
        this.currentQuestion = game.question_list[game.current_question];
        console.log("currentGame, questions and currentQuestion updated via subscription")
      });
  }

  // getPlayerList(){
  //   return this.playersList;
  // }


  //
  // Switching between the 5 game phases (starting)
  //
  //

  // STEP #1 
  // Show countdown timer shows on screen
  gameStateCountdown(){
    //var players;
    if(this.playersList==undefined){
      alert("There are currently no students in this game")
    }else{
    this.hostService.editGameState('countdown');
    this.PreQuestionTimer();
    }
  }

  // STEP #2
  // Add's a delay of X seconds before showing the Pre-Question state.
  //
  PreQuestionTimer(){
    this.setTab("chart");
    console.log("PreGameTimer method called");
    this.time = this.PreQuestionCountdownLengthInSeconds;
    var interval = setInterval(data => {
      if(this.time != 1){
        this.time --;
      }
      else {
        clearInterval(interval);
        this.gameStatePreQuestion();
      }
    }, 1000);
  }

  // STEP #3
  // Set's game state to 'prequestion'
  // Displays timer for X number of seconds
  //
  // TODO: STZ, Can we remove this substring code?  I don't believe it's needed
  gameStatePreQuestion(){
    this.time = this.questionReviewCountdownLengthInSeconds;  
    var substring;

    this.hostService.editGameState('prequestion');
    substring = this.currentQuestion.prompt;
    this.currentQuestionSubstring = substring.substring(0, 5);
    var interval = setInterval(data => {
      if(this.time != 1){
        this.time --;
      }
      else {
        clearInterval(interval);
        this.gameStateQuestion();
      }
    }, 1000);
  }

  // STEP #4: Question 
  // game_state set to 'question'
  // Timer started
  gameStateQuestion(){
    this.hostService.editGameState('question');
    this.time = this.currentQuestion.time;
    this.interval = setInterval(data => {
      if(this.time != 1){
        let counter = 0; // Counting answers
        for (let key of Object.keys(this.playersList)) {
          let playerInfo = this.playersList[key]
          if(playerInfo.answered===true){
            counter += 1
          };
        }
        // If everyone has submitted an answer, finish countdown
        if(counter === Object.keys(this.playersList).length){
        this.endTimer();
      }
        this.time --;
      }
      else {
        this.endTimer();
      }
    }, 1000);
  }

  // STEP #4.2: Stop timer
  // Clears the timer
  endTimer(){
    clearInterval(this.interval);
    this.gameStateAnswer();
  }

  // STEP #5: Answer
  //  Set's game_state to 'answer'
  // Answer distribution chart visible
  //
  // TODO: We need to make the answer more visible
  //
  gameStateAnswer(){
     this.hostService.editGameState('answer');
  }

  // Host shows current users ranks
  gameStateCurrentRankings(){
    this.hostService.editGameState('ranking');
  }

  gameStateLeaderboard(){
    this.hostService.nextQuestion(this.currentGame.current_question);
    this.getLeaderboard();
    this.hostService.editGameState('leaderboard');
  }
  //switching between the 5 game phases (end)

  //Skip button. If students answer before teacher skips, it will reset their points.
  // editStudentPointsIfAnswered(){
  //   var player
  //   var gameKey
  //   // this.subGame.subscribe(data => {
  //   //   player = data["player_list"]
  //   // })
  //   for (let key of Object.keys(player)) {
  //     let playerInfo = player[key]
  //     if(playerInfo.answered){
  //       this.subGame.subscribe(data => {
  //         gameKey=data["$key"]
  //       })
  //       var student = this.studentService.getStudent(key,gameKey)
  //       this.studentService.editSkipPoints(student,playerInfo.points,playerInfo.questionPoints)
  //     }
  //   }
  //     this.gameStateLeaderboard()
  // }


  deleteStudent(player){
    this.hostService.deletePlayer(player)
  }

  endGame(){
    this.hostService.gameOver();
    this.hostService.editGameState('leaderboard');
    this.getLeaderboard();
  }

    getLeaderboard(){
    this.setTab('leaderboard');
    var leaderboard = [];
    // var players;
    //    var current = this;
    // this.playersList.subscribe(data => {
    //   players = data;
    // })
    leaderboard = this.playersList.sort(function(a, b){
      return b.points-a.points
    })
    this.topPlayers = leaderboard.slice(0, 5);
  }

  // nextQuestionWithoutLeaderboard() {
  //   this.gameStateLeaderboard();
  //   this.gameStateCountdown();
  // }

  continueGame() {
    let questionsRemaining = this.questions.length - (this.currentGame.current_question + 1); 
        
    // Add logic to see if the game is over
    if(questionsRemaining == 0){
      this.endGame();
    }
  
    console.log("Questions remaining =" + questionsRemaining.toString())

    this.hostService.nextQuestion(this.currentGame.current_question);
    // STZ: Not sure this is still needed.
    this.hostService.editGameState('leaderboard');
    this.gameStateCountdown();
  }
}
