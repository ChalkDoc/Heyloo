import { Injectable } from '@angular/core';
import { Game } from './game.model';
import { Player } from './player.model';
import { Question } from './question.model';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { HostService } from './host.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class StudentService {
  
  //players: FirebaseListObservable<any[]>;
  //subPlayers: Player[];

  // STZ added variables
  private gameBasePath: string = '/games';
  private playerBasePath: string = '/players';

  //player: FirebaseListObservable<Player[]>; 
  player: FirebaseListObservable<Player[]>; 
  players: FirebaseListObservable<Player[]>; 


  constructor(private database: AngularFireDatabase, private hostService: HostService) { }

  //STZ additions
    // Returns a player FirebaseListObservable from game code and player id
    getPlayerFromId(playerId: number): FirebaseListObservable<Player[]> {
      this.player = this.database.list(this.playerBasePath, {
        query: {
          orderByChild: 'id',
          equalTo: playerId,
          limitToFirst: 1
        }
      })
      return this.player;
    }

    // // Returns a player FirebaseListObservable from game code and player id
    // getPlayerFromRoomCodeAndId(roomCode: number, playerId: number): Observable<Player> {
    //   this.player = this.database.list(this.playerBasePath , {
    //     query: {
    //       orderByChild: 'id',
    //       equalTo: playerId,
    //       limitToFirst: 1
    //     }
    //   }).filter(item => {
    //       if(item.gameId == 666){
    //         return true
    //       } else { return false }
    //     });
    //   return this.player;
    // }


    // STZ Added
    // getPlayerListByGameKey(gameKey:){

    // }




  // addStudent(newPlayer: Player) {
  //   this.players.push(newPlayer);
  // }

  // getStudent(id: string, gamekey: string){
  //   return this.database.object('games/' + gamekey + '/player_list/' + id);
  // }

  // getStudentGameKeyAndId(key: string, id: number){
  //   var retrievedStudent
  //   this.players = this.database.list('games/' + key + '/player_list');
  //   this.players.subscribe(data => {
  //     this.subPlayers = data
  //   })
  //   for(let i=0; i<this.subPlayers.length; i++){
  //     if(this.subPlayers[i]['id'] == id){
  //       retrievedStudent = this.getPlayerFromId(this.subPlayers[i]['$key'], key);
  //     }
  //   }
  //   return retrievedStudent;
  // }

  editStudentPoints(student, correct, score){
    var totalPoints;
    var totalCorrect;
    var totalWrong;
    student.subscribe(data => {
      totalPoints = data.points;
      totalCorrect = data.correct;
      totalWrong = data.wrong;
    })
    if(correct == true){
      student.update({points: (totalPoints + score), correct: (totalCorrect + 1), questionPoints: score, answered: true});
    }
    else if(correct == false){
      student.update({wrong: (totalWrong + 1), questionPoints: 0, answered: true});
    }
  }

  resetPlayerForNextQuestion(player){
    this.database.object(this.playerBasePath + '/' + player.key).update({answered: false, questionPoints: 0})
  }

  editSkipPoints(student,totalPoints,score){
    student.update({points: (totalPoints - score), answered: false});
    student.subscribe(data => {
    })
  }
}
