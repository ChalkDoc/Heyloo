import { Injectable } from '@angular/core';
import { Game } from './game.model';
import { Player } from './player.model';
import { Question } from './question.model';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { QUESTIONS } from './sample-questions';
import { Observable } from 'rxjs/Observable';

// Added by STZ for Chalkdoc integration
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';


@Injectable()
export class HostService {

  private basePath: string = '/games';
  gamesRef;
  games: FirebaseListObservable<Game[]> = null;  //A list of Games from Firebase
  game: FirebaseObjectObservable<Game> = null; // the current game
  playerList: FirebaseListObservable<Player[]> = null; //Current

  //subGames: Game[]; // our list of games

  constructor(private database: AngularFireDatabase, private http: Http) {
    
    // A list of games as an observable
    // Database reference to the main Games list
    //const gamesRef = database.list(this.basePath);

  }

  // STZ: Added error handling, created new Error handling method
  // STZ: Removed return value
  //Creates a new game when passed a complete Game
  createGame(newGame: Game): void{
    this.games.push(newGame)
      .catch(error => this.handErrorToConsole(error))
  }


  // Returns a list of games Observable
  getGames(){
    return this.gamesRef.snapshotChanges();
  }

  // // Returns a game Observable from game code
  // getGame(roomCode: number) {
  //   return this.database.list(this.basePath);
  // }

  // Returns a game Observable from game code
  getGame(roomCode: number) {
    //let test: number = 77754;
    return this.database.list(this.basePath, {
      query: {
        orderByChild: 'id',
        equalTo: roomCode
      }
    });
  }

  // Add a player to a specific game
  // STZ: TODO this currently does not have any error handling
  // such as if the player name is already taken
  addPlayer(gameKey: string, player: Player){
    const gamePath =  `${this.basePath}/${gameKey}/player_list`;
    this.playerList = this.database.list(gamePath);
    this.playerList.push(player);
  }

  // Added by STZ
  // Helper function that converts a snapshot to an array,
  // including the key
  snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
  };

  // getGame(chosenGameId: string){
  //   return this.database.object('games/' + chosenGameId);
  // }

  // this returns a DB reference
  // getGameFromCode(roomcode: number){
  //   var thisGame;
  //   console.log("subgames is: " + this.subGames)
  //   for(let i=0; i<this.subGames.length; i++){
  //     if(this.subGames[i].id == roomcode){
  //       thisGame = this.getGame(this.subGames[i]['$key']);
  //     }
  //   }
  //   if (thisGame != undefined) {
  //     return thisGame;
  //   } else {
  //     alert('There\'s no game with that code. Please try again!');
  //   }
  // }

  getCurrentGamePlayerList(id: string){
    return this.database.list('games/' + id + '/player_list')
  }

  // Added by STZ
  randomId(){
    return Math.floor(Math.random()*90000) + 10000;
  }

  // from STZ - currently we get these questions from code, but we need to get them from Firebase instead
  getQuestions() {
    return QUESTIONS;
  }

  getFirebaseQuestions(id: string){
    return this.database.list('games/' + id + '/question_list')
  }


  // STZ: Currently hard coded to the assets folder
  // public getJSONQuestions(id: String): Observable<any> {
  //   return this.http.get("./assets/chalkdoc/"+ id + ".json")
  //                   .map((res:any) => res.json())
  //                   .catch((error:any) => {
  //                     console.log(error)
  //                     return error;
  //                   });
  // }

  getJSONQuestions(id: string): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json', 
    'Accept': 'q=0.8;application/json;q=0.9' });
    let options = new RequestOptions({ headers: headers });
    return this.http
        .get("./assets/chalkdoc/"+ id + ".json", options)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
  }

  private extractData(res: Response) {
      let body = res.json();
      return body || {};
  }

  //STZ: Why is this returning a promise?? 
  //Our error handler
  private handleError(error: any): Promise<any> {
      console.error('An error occurred', error);
      return Promise.reject(error.message || error);
  }  



  // editGameState(gameState, game){
  //   var currentGame = this.getGameFromCode(game.id);
  //   currentGame.update({game_state: gameState});
  // }

  editGameState(gameState){
    this.game.update({game_state: gameState});
  }

  // this creates a listener that fires when
  // current_question changes on the server
  // nextQuestion(game) {
  //   var nextQuestion;
  //   var currentGame = this.getGameFromCode(game.id); // returns a db ref to our game

  //   // is this subscribe code needed?
  //   currentGame.subscribe(data => {
  //     nextQuestion = data['current_question'];
  //   })
  //   // This should be inside the subsciption right?
  //   currentGame.update({current_question: nextQuestion + 1});
  // }

  nextQuestion(game) {
    this.game.take(1).subscribe(gameData => {
      let currentQuestion: number = gameData.current_question;
      this.game.update({current_question: currentQuestion+1})
    });
  }

  // gameOver(game){
  //   var currentGame = this.getGameFromCode(game.id);
  //   currentGame.update({game_over: true});
  // }

  gameOver(){
    this.game.update({game_over: true});
  }

  // updatePlayerList(players, game){
  //   var currentGame = this.getGameFromCode(game.id);
  //   currentGame.update({player_list: players});
  // }

  updatePlayerList(players){
    this.game.update({player_list: players});
  }

  // updatePlayerChoice(questions, game){
  //   var currentGame = this.getGameFromCode(game.id);
  //   currentGame.update({question_list: questions});
  // }

  updatePlayerChoice(questions){
    this.game.update({question_list: questions});
  }

  // Default error handling for all actions
  private handErrorToConsole(error) {
    console.log(error)
  }

  // // Added by STZ
  // addPlayer(player: Player){
  //   this.playerList.push(player);
  // }



}
