import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Player } from '../player.model';
import { Game } from '../game.model';
import { HostService } from '../host.service';
import { StudentService } from '../student.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { RouterModule, Routes } from '@angular/router';
import * as Rx from "rxjs/Rx";
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [HostService, StudentService]
})
export class RegisterComponent implements OnInit {
  public game: Game;
  currentPlayer: Player;

  constructor(private studentService:StudentService, private hostService: HostService, private router: Router) { }

  ngOnInit() {
    //this.games = this.hostService.getGames();
  }

    // 1. Confirm game code is valid
    // 2. Get Game Key
    // 3. Create new player
    // 4. Add player to game
    // 5. navigate to Student with correct credentials

  register(username: string, codeString: string){
    
    let gameCode: number = parseInt(codeString); // have to convert to number, because NG only passes strings

    // Using First() because without it the subscription fires each time ANY 
    // user, including ourselves alters the game state
    this.hostService.getGame(gameCode)
      .first()
      .finally(()=>{
        // route to the student view
        //this.router.navigate(['student', this.game.id, this.currentPlayer.id]);     
      })
      .subscribe(gameReturned => {
        if(gameReturned.length==1){
          this.game = gameReturned[0];
          this.game.key = gameReturned[0].$key; // Get's the key for this game
    
          // create a new user
          this.currentPlayer = new Player(username, 0, 0, this.hostService.randomId(), false, "0");
    
          // add user to game
          this.hostService.addPlayer(this.game.key,this.currentPlayer);
        } else {
          alert("Room Code is not valid");        
        }
      }, err => {
        alert("Houston we have a problem");
      });
  }

  //Added by STZ
  // snapshotToArray(snapshot) {
  //   var returnArr = [];

  //   snapshot.forEach(function(childSnapshot) {
  //       var item = childSnapshot.val();
  //       item.key = childSnapshot.key;
  //       returnArr.push(item);
  //   });

  //   return returnArr;
  // };

}
