import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { HostService} from '../host.service';
import { Question } from '../question.model';
import { Game } from '../game.model';
import { StudentService } from '../student.service';

@Component({
  selector: 'host-component',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css'],
  providers: [HostService,StudentService]
})

export class HostComponent {

  games: FirebaseListObservable<any[]>;
  subGame: FirebaseObjectObservable<any[]>;
  playerList: FirebaseListObservable<any[]>;
  gameId;
  public currentGame;
  questions: Question[];
  currentQuestion: Question;
  time: number = 0;
  topPlayers;
  private showQuestion = false;
  private hideBarGraph = true;
  currentQuestionSubstring;

  questionsRemaining: number;
  private id: string; // Test code by STZ
  private path: String; // Test code by STZ


  constructor(private route: ActivatedRoute, private hostService: HostService, private studentService:StudentService, private router: Router, private location: Location) {
  }

  ngOnInit() {
    var gameKey;

    this.id = this.route.snapshot.params.id;
    this.path = this.route.snapshot.url[0].toString();
    console.log(" Id is: " + this.id);
    console.log(" Route is: " + this.path);
    if(this.path == 'chalkdoc'){
      this.hostService.getJSON(this.id).subscribe(data => {
        console.log("data found: " + JSON.stringify(data));
        
        // Assign results to questions
        this.questions = data;
        // How many questions remain in the game
        this.questionsRemaining = this.questions.length - 1;
      }, error => {
        console.log(error)
      });
    } else{
      this.questions = this.hostService.getQuestions();
    }

    this.games = this.hostService.getGames();
    this.route.params.forEach((urlParameters) => {
      this.gameId = urlParameters["id"];
    });
    this.hostService.getGameFromCode(this.gameId).subscribe(data => {
      this.currentGame = new Game
      (data.id,
      data.game_state,
      data.game_over,
      data.player_list,
      data.question_list)
      });
      this.subGame = this.hostService.getGameFromCode(this.currentGame.id);
      this.getPlayerList(this.currentGame.id);

      // This ensures currentQuestion is always up to date.
      this.subGame.subscribe(data => {
        gameKey = data['$key'];
        this.currentQuestion = data['question_list'][data['current_question']];
      })
  }

  getPlayerList(gameId: number){
    this.subGame = this.hostService.getGameFromCode(gameId);
    this.subGame.subscribe(data=>{
      this.playerList = this.hostService.getCurrentGamePlayerList(data["$key"]);
    })
    return this.playerList;
  }

  //switching between the 5 game phases (start)

  // countdown timer shows on screen
  gameStateCountdown(){
    var players;
    this.subGame.subscribe(data => {
      players = data["player_list"]
    })
    if(players==undefined){
      alert("There are currently no students in this game")
    }else{
    this.hostService.editGameState('countdown', this.currentGame);
    this.fiveSeconds();
    }
  }

  // Question is shown for certain amount of time without answers
  gameStatePreQuestion(){
    var substring;
    this.hostService.editGameState('prequestion', this.currentGame);
    substring = this.currentQuestion.prompt;
    this.currentQuestionSubstring = substring.substring(0, 5);
    this.preQuestionCountdown();
  }

  // Question is visible, voting opens
  gameStateQuestion(){
    this.hostService.editGameState('question', this.currentGame);
    this.thirtySeconds();
  }

  //  Answer Distrobution Chart visible
  gameStateAnswer(){
    this.hostService.editGameState('answer', this.currentGame);
  }

  // Host shows current users ranks
  gameStateCurrentRankings(){
    this.hostService.editGameState('ranking', this.currentGame);
  }

  gameStateLeaderboard(){
    this.hostService.nextQuestion(this.currentGame);
    this.getLeaderboard();
    this.hostService.editGameState('leaderboard', this.currentGame);
  }
  //switching between the 5 game phases (end)

  //Skip button. If students answer before teacher skips, it will reset their points.
  editStudentPointsIfAnswered(){
    var player
    var gameKey
    this.subGame.subscribe(data => {
      player = data["player_list"]
    })
    for (let key of Object.keys(player)) {
      let playerInfo = player[key]
      if(playerInfo.answered){
        this.subGame.subscribe(data => {
          gameKey=data["$key"]
        })
        var student = this.studentService.getStudent(key,gameKey)
        this.studentService.editSkipPoints(student,playerInfo.points,playerInfo.questionPoints)
      }
    }
      this.gameStateLeaderboard()
  }

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

  deleteStudent(player){
    var players;
    this.playerList.subscribe(data => {
      players = data;
    })
    for(let i = 0; i < players.length; i++){
      if(players[i].id == player.id){
        players.splice(i, 1);
      }
    }
    this.hostService.updatePlayerList(players, this.currentGame);
  }

  endGame(){
    this.hostService.gameOver(this.currentGame);
    this.hostService.editGameState('leaderboard', this.currentGame);
    this.getLeaderboard();
  }

  getLeaderboard(){
    var leaderboard = [];
    var players;
    var current = this;
    this.playerList.subscribe(data => {
      players = data;
    })
    leaderboard = players.sort(function(a, b){
      return b.points-a.points
    })
    this.topPlayers = leaderboard.slice(0, 5);
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
