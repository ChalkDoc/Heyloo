import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
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
  styleUrls: ['./host.component.css'],
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

  //STZ Variables
  gameKey: string;
  games: Game[];
  urlParamRoomCode: number;
  currentGame: Game;
  playersList: Player[]; 
  questions: Question[];
  // questionsRemaining: number;
  time: number = 0;  // Timer variable

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

  // Get a subscription to the game Observable
  getGame(key: string){
    this.hostService.getGameByKey(key)
      .subscribe(game => {
        this.currentGame = game;
        this.questions = game.question_list;
        
        this.currentQuestion = game.question_list[game.current_question];
      });
  }

  getPlayerList(){
    return this.playersList;
  }

  //switching between the 5 game phases (start)

  // countdown timer shows on screen
  gameStateCountdown(){
    //var players;
    if(this.playersList==undefined){
      alert("There are currently no students in this game")
    }else{
    this.hostService.editGameState('countdown');
    this.fiveSeconds();
    }
  }


  // Question is shown for certain amount of time without answers
  gameStatePreQuestion(){
    var substring;
    this.hostService.editGameState('prequestion');
    substring = this.currentQuestion.prompt;
    this.currentQuestionSubstring = substring.substring(0, 5);
    this.preQuestionCountdown();
  }

  // Question is visible, voting opens
  gameStateQuestion(){
    this.hostService.editGameState('question');
    this.startTimer();
  }

  //  Answer Distrobution Chart visible
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


  fiveSeconds(){
    this.time = 3;
    var interval = setInterval(data => {
      if(this.time != 0){
        this.time --;
      }
      else {
        clearInterval(interval);
        this.gameStatePreQuestion();
      }
    }, 1000);
  }

  preQuestionCountdown(){
    this.time = 2;
    var interval = setInterval(data => {
      if(this.time != 0){
        this.time --;
      }
      else {
        clearInterval(interval);
        this.gameStateQuestion();
      }
    }, 1000);
  }

  //If all students answer during question phase, gameStateAnswer() will run
  startTimer(){
    this.time = this.currentQuestion.time;
    var interval = setInterval(data => {
      if(this.time != 0){
        let counter = 0; // Counting answers
        for (let key of Object.keys(this.playersList)) {
          let playerInfo = this.playersList[key]
          if(playerInfo.answered===true){
            counter += 1
          };
        }
        // If everyone has submitted an answer, finish countdown
        if(counter === Object.keys(this.playersList).length){
        clearInterval(interval);
        this.gameStateAnswer();
      }
        this.time --;
      }
      else {
        clearInterval(interval);
        this.gameStateAnswer();
      }
    }, 1000);
  }

  deleteStudent(player){
    this.hostService.deletePlayer(player)
  }


  // endGame(){
  //   this.hostService.gameOver(this.currentGame);
  //   this.hostService.editGameState('leaderboard', this.currentGame);
  //   this.getLeaderboard();
  // }

  endGame(){
  
  }

  getLeaderboard(){
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
    console.log("Questions remaining =" + questionsRemaining.toString())
    
    // Add logic to see if the game is over
    if(questionsRemaining == 0){
      this.endGame();
    }
  
    // This shows the leaderboard
    this.gameStateLeaderboard();
  }
}
