import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Game } from './game.model';
import { Player } from './player.model';
import { Question } from './question.model';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import { QUESTIONS } from './sample-questions';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class HostService {
  games: FirebaseListObservable<any[]>;
  subGames: Game[]; // our list of games

  constructor(private database: AngularFireDatabase, private http: Http) {
    this.games = database.list('games');
    this.games.subscribe(data => {this.subGames = data})
  }

  getGames(){
    return this.games;
  }

  getGame(chosenGameId: string){
    return this.database.object('games/' + chosenGameId);
  }

  // this returns a DB reference
  getGameFromCode(roomcode: number){
    var thisGame;
    for(let i=0; i<this.subGames.length; i++){
      if(this.subGames[i].id == roomcode){
        thisGame = this.getGame(this.subGames[i]['$key']);
      }
    }
    if (thisGame != undefined) {
      return thisGame;
    } else {
      alert('There\'s no game with that code. Please try again!');
    }
  }

  getGameKey(game){
    game.subscribe(data => {
      return data['$key'];
    })
  }

  getCurrentGamePlayerList(id: string){
    return this.database.list('games/' + id + '/player_list')
  }

  randomId(){
    return Math.floor(Math.random()*90000) + 10000;
  }

  createGame(newGame: Game){
    this.games.push(newGame);
    return newGame;
  }

  // from STZ - currently we get these questions from code, but we need to get them from Firebase instead
  getQuestions() {
    return QUESTIONS;
  }

  // STZ: Currently hard coded to the assets folder
  public getJSON(id: String): Observable<any> {
    return this.http.get("./assets/chalkdoc/"+ id + ".json")
                    .map((res:any) => res.json())
                    .catch((error:any) => {
                      console.log(error)
                      return error;
                    });
  }


  editGameState(gameState, game){
    var currentGame = this.getGameFromCode(game.id);
    currentGame.update({game_state: gameState});
  }

  // this creates a listener that fires when
  // current_question changes on the server
  nextQuestion(game) {
    var nextQuestion;
    var currentGame = this.getGameFromCode(game.id); // returns a db ref to our game

    // is this subscribe code needed?
    currentGame.subscribe(data => {
      nextQuestion = data['current_question'];
    })
    // This should be inside the subsciption right?
    currentGame.update({current_question: nextQuestion + 1});
  }

  gameOver(game){
    var currentGame = this.getGameFromCode(game.id);
    currentGame.update({game_over: true});
  }

  updatePlayerList(players, game){
    var currentGame = this.getGameFromCode(game.id);
    currentGame.update({player_list: players});
  }

  updatePlayerChoice(questions, game){
    var currentGame = this.getGameFromCode(game.id);
    currentGame.update({question_list: questions});
  }

}
