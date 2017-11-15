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


  // subStudent;
  // allPlayers;
  
  currentPosition;
  totalPositions;
  previousPosition;
  positionChange;
  positionChangeColor;

  // STZ Variables
  urlParamRoomCode: number;
  urlParamStudentId: number;
  currentGame: Game = null;
  currentQuestion: Question; 
  player: Player;
  playersList: Player[];
  startTime; // For each question the time started
  endTime; // For each question the time ended
  previousGameState: string;
  gameState: string;
  questionStarted: boolean = false; // Tracking needed to keep timer times correct

  //still needed?
  sortedPlayers = [];

  constructor(private route: ActivatedRoute, private router: Router, private hostService: HostService) { }

  ngOnInit() {
    
    // Get the parameters from the URL
    this.route.params.forEach(urlParameters => {
      this.urlParamRoomCode = parseInt(urlParameters['roomcode']);
      this.urlParamStudentId = parseInt(urlParameters['studentid']);
    })

    //Subscribe to game from roomcode
    this.hostService.getGameAndKey(this.urlParamRoomCode)
    .subscribe(gameReturned => {
      if(gameReturned.length==1){
        this.currentGame = gameReturned[0];
        this.currentGame.key = gameReturned[0].$key; // Get's the key for this game
        
        // Helper variable to track the current question
        this.currentQuestion = this.currentGame.question_list[this.currentGame.current_question];

        // Now move to step 2
        this.getPlayer(this.urlParamStudentId);
        
      } else {
        alert("Room Code is not valid");        
      }
    }, err => {
      alert("Houston we have a problem");
    });

    // Subscribe to a Players list
    // for the leaderboard view
    this.hostService.getPlayersList(this.urlParamRoomCode)
      .subscribe(players => {
        this.playersList = players;
      }, err => {
        console.log("We got an error, getting the list of players")
      })

  } // end of onInit

  // Start the Player subscription
  getPlayer(playerId: number){
    this.hostService.getPlayerFromId(playerId)
    .subscribe(data => {
      this.player = data[0];
      this.player.key = data['0'].$key;
    })
  }


  // Step #2, get the list of players
  // getPlayerList(gameKey: string){
  //   this.hostService.getPlayersList(gameKey)
  //     .subscribe(playerlist => {
  //       this.playersList = playerlist;

  //       // On to Step 3
  //       this.getPlayerSubscription();

  //     }, err => {
  //       alert("Error getting the Player list");
  //     } );
  // }

  // //Step #3, subscribe to the specific user
  // getPlayerSubscription(){
  //   this.playersList.forEach(player => {
  //     if(player.id==this.urlParamStudentId){
  //       this.hostService
  //     }
  //   });
  // }


  // we need to get rid of this, it's causing a lot of problems
  ngDoCheck(){

    // Only do something if the state has changed
    if((this.currentGame!=null)&&(this.currentGame.game_state!=this.previousGameState)){

      // Remember the previous state
      this.previousGameState = this.currentGame.game_state

      switch(this.currentGame.game_state){
        
        case 'starting':
          console.log('In Starting state');
          break;
        case 'question':          
          console.log('In Question state');
          this.setStartTime()
          break;
        case 'answer':
          console.log('In Answer state');
          this.AnswerGameState();
          
          break;        
        case 'leaderboard':
          console.log('In leaderboard state');
          this.startTime = null
          this.hostService.resetPlayerForNextQuestion(this.player);
          break;
        default:
      } // End of Switch
    } // End of If
  } // End of ngDoCheck


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

    // Need to remember to parseInt form values.
    this.hostService.submitPlayersAnswer(this.currentGame.key, this.currentGame.current_question, answer);

    //Stop the timer
    this.setEndTime();

    // determine score
    if(answer == this.currentQuestion.answer){
      this.hostService.editPlayerPoints(this.player, true, this.scoringAlgorithm(this.endTime, this.startTime));
    }
    else{
      this.hostService.editPlayerPoints(this.player, false, 0);
    }
  }

  // number of milliseconds
  //
  // 1000 maximum score, 500 minimum score
  // End-start returns a number of milliseconds (eg 2472 ms)
  // Dividing by 1000 gives us a elapsed time for the question in seconds (eg 2 sec)
  // Divided by currentQuestion.time (20') gives us a percentage moving (eg .1)

  // TODO: Add Unit tests here

  scoringAlgorithm(end, start){
    // See: https://stackoverflow.com/questions/16066388/why-new-date-gettime-returns-too-much-0-in-javascript
    let step1 = (end - start); // Milliseconds to answer
    console.log("response time is: " + step1 + " milliseconds");
    let step2 = step1 / 1000; // Seconds to answer 
    let step3 = step2 / this.currentQuestion.time; // Percentage of score to receive moving to 1 
    let step4 = step3 / 2;
    let step5 = 1 - step4;
    let step6 = 1000 * step5;
    console.log("score for this question is:" + step6);
    this.resetTimers();
    return step6;
    // return Math.round(1000 * (1 - ((((end - start) / 1000)/this.currentQuestion.time)/2)));
  }

  //reset the timers after each question
  resetTimers(){
    this.startTime = null;
    this.endTime = null;
  }

  AnswerGameState(){
    this.getLeaderboard();
    this.getLeaderboardChange();
  }

  setStartTime(){        
      this.startTime = new Date().getTime();
      console.log("Time started at = " + this.startTime.toString());
  }

  setEndTime(){
    // Register when they submitted an answer
    this.endTime = new Date().getTime();
    console.log("End time = " + this.endTime.toString());
  }

  getLeaderboard() {
    // this.allPlayers = this.studentService.subPlayers;
    this.sortedPlayers = this.playersList.slice().sort(function(a, b) {
      return b.points - a.points;
    });
    for (var i = 0; i < this.sortedPlayers.length; i++) {
      if (this.sortedPlayers[i].id == this.player.id) {
        this.currentPosition = i+1;
      }
    }
    this.totalPositions = this.sortedPlayers.length;
  }

  getLeaderboardChange() {
    var change;
    if (this.previousPosition == undefined) {
      this.positionChange = ''
      this.positionChangeColor = ''
    } else {
      change = this.previousPosition - this.currentPosition;
      if ( change > 0) {
        this.positionChange = 'Ranking: You advanced ' + Math.abs(change) + ' position(s). Good job!';
        this.positionChangeColor = 'green-text'
      } else if ( change < 0 ){
        this.positionChange = '';
        // this.positionChangeColor = 'red-text'
      } else if ( change == 0 ){
        this.positionChange = 'Ranking: Your ranking hasn\'t changed.';
        this.positionChangeColor = ''
      }
    }
  }



}
