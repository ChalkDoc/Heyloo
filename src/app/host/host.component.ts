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
  gameObserver;
    
  //public currentGame; //What type of variable is this?
  questions: Question[];
  currentQuestion: Question;
  time: number = 0;  // Timer variable
  topPlayers;
  private showQuestion = false;
  private hideBarGraph = true;
  currentQuestionSubstring;

 
  private id: string; // Test code by STZ
  private path: String; // Test code by STZ

  //STZ Variables
  games: Game[];
  urlParamRoomCode: number;
  currentGame: Game;
  playersList: Player[]; 
  questionsRemaining: number;

  constructor(private route: ActivatedRoute, private hostService: HostService, private studentService:StudentService, private router: Router, private location: Location) {
  }

  ngOnInit() {
    //Why is this not a class variable?
    //var gameKey;

    // Why is this needed?
    //this.questions = this.hostService.getQuestions();
    
    // How many questions remain in the game
    // This was a temporary fix.  Needs to be put in game state.
    this.questionsRemaining = this.questions.length - 1;

    //Is this needed?  I don't think so
    //this.games = this.hostService.getGames();
    

    //Get the ID for the game we're about to host from the URL
    this.route.params.forEach((urlParameters) => {
      this.urlParamRoomCode = urlParameters["roomCode"];
    });

    console.log("Room code is: " + this.urlParamRoomCode);

    // Sets the game in the Host Service so we're getting data from 
    // the correct game in Firebase 
   // this.hostService.setGameKey(this.roomCode);

    // Gets a local version of the current game Observable
   // this.currentGame = this.hostService.getGame();
    
    // Not sure if we really need an observer variable or not
    // this.gameObserver = this.currentGame.subscribe(gameData => {
    //   this.currentQuestion = gameData['question_list'][gameData['current_question']];
    //   this.playerList = gameData['player_list']
    //   console.log("Game data changed");
    // });

    //get the current game
    //Subscribe to game from roomcode
    this.hostService.getGame(this.urlParamRoomCode)
      .subscribe(gameReturned => {
        if(gameReturned.length==1){
          this.currentGame = gameReturned[0];
          this.currentGame.key = gameReturned[0].$key; // Get's the key for this game   
          
        } else {
          alert("Room Code is not valid");        
        }
      }, err => {
        alert("Houston we have a problem");
      });

    // Subscribe to a Players list
    this.hostService.getPlayersList(this.urlParamRoomCode)
      .subscribe(players => {
        this.playersList = players;
      }, err => {
        console.log("We got an error, getting the list of players")
      });

    // This subscribes currentQuestion to FB's current question.
    // this.subGame.subscribe(data => {
    //   gameKey = data['$key'];

    //   console.log(data['id']);
    //   console.log(data['game_state']);
    //   console.log(data['game_over']);
    //   console.log(data['player_list']);
    //   console.log(data['question_list']);
    //   console.log(data['questionsRemaining']);

    //   // this.currentGame = new Game
    //   // (data['id'],
    //   // data['game_state'],
    //   // data.game_over,
    //   // data.player_list,
    //   // data.question_list,
    //   // data.questionsRemaining);

    //   this.currentQuestion = data['question_list'][data['current_question']];
    // })


    //This subscribes currentGame to the FB game state variables
    // this.hostService.getGameFromCode(this.roomCode).subscribe(data => {
    //   this.currentGame = new Game
    //   (data.id,
    //   data.game_state,
    //   data.game_over,
    //   data.player_list,
    //   data.question_list,
    //   data.questionsRemaining)
    //   });

     // this.getPlayerList(this.currentGame.id);

      // // This subscribes currentQuestion to FB's current question.
      // this.subGame.subscribe(data => {
      //   gameKey = data['$key'];
      //   this.currentQuestion = data['question_list'][data['current_question']];
      // })
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
    this.thirtySeconds();
  }

  //  Answer Distrobution Chart visible
  gameStateAnswer(){
    // this.hostService.editGameState('answer', this.currentGame);
  }

  // Host shows current users ranks
  gameStateCurrentRankings(){
    this.hostService.editGameState('ranking');
  }

  gameStateLeaderboard(){
    this.hostService.nextQuestion(this.currentGame);
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
  thirtySeconds(){
    this.time = this.currentQuestion.time;
    var interval = setInterval(data => {
      if(this.time != 0){
        let counter = 0; // Counting answers
        for (let key of Object.keys(this.currentGame.player_list)) {
          let playerInfo = this.currentGame.player_list[key]
          if(playerInfo.answered===true){
            counter += 1
          };
        }
        // If everyone has submitted an answer, finish countdown
        if(counter === Object.keys(this.currentGame.player_list).length){
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

  // deleteStudent(player){
  //   var players;
  //   this.playerList.subscribe(data => {
  //     players = data;
  //   })
  //   for(let i = 0; i < players.length; i++){
  //     if(players[i].id == player.id){
  //       players.splice(i, 1);
  //     }
  //   }
  //   this.hostService.updatePlayerList(players, this.currentGame);
  // }

  deleteStudent(player){
  }

  // endGame(){
  //   this.hostService.gameOver(this.currentGame);
  //   this.hostService.editGameState('leaderboard', this.currentGame);
  //   this.getLeaderboard();
  // }

  endGame(){
  
  }

  // getLeaderboard(){
  //   var leaderboard = [];
  //   var players;
  //   var current = this;
  //   this.playerList.subscribe(data => {
  //     players = data;
  //   })
  //   leaderboard = players.sort(function(a, b){
  //     return b.points-a.points
  //   })
  //   this.topPlayers = leaderboard.slice(0, 5);
  // }

  getLeaderboard(){
  
  }
  // nextQuestionWithoutLeaderboard() {
  //   this.gameStateLeaderboard();
  //   this.gameStateCountdown();
  // }

  continueGame() {
    // Add logic to see if the game is over
    if(this.questionsRemaining == 0){
      this.endGame();
    }
    console.log("Questions remaining =" + this.questionsRemaining.toString())
    this.questionsRemaining--;
    // This shows the leaderboard
    this.gameStateLeaderboard();
  }
}
