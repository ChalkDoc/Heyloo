import { Injectable } from '@angular/core';
import { Game } from './game.model';
import { Player } from './player.model';
import { Question } from './question.model';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { HostService } from './host.service';

@Injectable()
export class StudentService {
  players: FirebaseListObservable<any[]>;
  subPlayers: Player[];

  constructor(private database: AngularFireDatabase, private hostService: HostService) { }

  addStudent(newPlayer: Player) {
    this.players.push(newPlayer);
  }

  getStudent(id: string, gamekey: string){
    return this.database.object('games/' + gamekey + '/player_list/' + id);
  }

  getStudentGameKeyAndId(key: string, id: number){
    var retrievedStudent
    this.players = this.database.list('games/' + key + '/player_list');
    this.players.subscribe(data => {
      this.subPlayers = data
    })
    for(let i=0; i<this.subPlayers.length; i++){
      if(this.subPlayers[i]['id'] == id){
        retrievedStudent = this.getStudent(this.subPlayers[i]['$key'], key);
      }
    }
    return retrievedStudent;
  }

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

  changeStudentsAnsweredToFalse(student){
    student.update({answered: false})
  }
}
