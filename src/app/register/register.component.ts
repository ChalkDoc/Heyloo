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
  //games: FirebaseListObservable<Game[]>;
  //subGames: Game[];
  //game: FirebaseObjectObservable<Game>;

  //playerList: FirebaseListObservable<Player[]>;
  //roomCode: number;
  public games = null;
  public game: Game;
  public playerList;
  public gameFound = false;
  gameKey: string;
  currentPlayer: Player;

  constructor(private studentService:StudentService, private hostService: HostService, private router: Router) { }

  ngOnInit() {
    //this.games = this.hostService.getGames();
  }

    //   .subscribe(games =>{
    //   this.snapshotToArray(games);
    // });



  // getBooksAndMovies() {
  //   Observable.forkJoin(
  //       this.http.get('/app/books.json').map((res:Response) => res.json()),
  //       this.http.get('/app/movies.json').map((res:Response) => res.json())
  //   ).subscribe(
  //     data => {
  //       this.books = data[0]
  //       this.movies = data[1]
  //     },
  //     err => console.error(err)
  //   );
  // }

  register(username: string, codeString: string){
    //this.roomCode = roomcode;
    // this.hostService.setGameKey(roomcode);

    // 1. Confirm game code is valid
    // 2. Get Game Key
    // 3. Create new player
    // 4. Add player to game
    // 5. navigate to Student with correct credentials
    
    let gameCode: number = parseInt(codeString); // have to convert to number, because NG only passes strings

    const obs = this.hostService.getGame(gameCode);

    const ObsFirst = obs.first()
    .finally(()=>{
      // route to the student view
      this.router.navigate(['student', this.game.id, this.currentPlayer.id]);     
    })
    .subscribe(gameReturned => {
      if(gameReturned.length==1){
        this.game = gameReturned[0];
        this.game.key = gameReturned[0].$key; // Get's the key for this game
  
        // create a new user
        this.currentPlayer = new Player(username, 0, 0, this.hostService.randomId(), false);
  
        // add user to game
        this.hostService.addPlayer(this.game.key,this.currentPlayer);
      } else {
        alert("Room Code is not valid");        
      }
    }, err => {
      alert("Houston we have a problem");
    });

    // this.games.subscribe(gameList =>{
    //   gameList.forEach(game =>{
    //     if(game.id == roomcode){
    //       // this sets game to the proper game in Firebase
    //       this.gameKey=game.key

    //       // create a new user
    //       let currentPlayer: Player = new Player(username, 0, 0, this.hostService.randomId(), false);

    //       // add user to game
    //       this.hostService.addPlayer(this.gameKey,currentPlayer);

    //       // route to the student view
    //       this.router.navigate(['student', roomcode, currentPlayer.id]);
    //     }
    //   })
    // })

      // let returnedGame: FirebaseObjectObservable<Game>;
  
      // if(this.game==null){
      //   let tempList; 
      //   this.database.list(this.basePath, {preserveSnapshot:true})
      //   .subscribe(gameList => {
      //     tempList = this.snapshotToArray(gameList);
      //     tempList.forEach(game =>{
      //       if(game.id == roomcode){
      //         // this sets game to the proper game in Firebase
      //         this.playerList = this.database.list(`${this.basePath}/${game.key}/player_list`)
      //         return this.database.object(`${this.basePath}/${game.key}`);
      //       }
      //     });
      //     if(this.game==null){
      //       alert('There\'s no game with that code. Please try again!');
      //     }  
      //   }); //end of subscribe
      //   return null;
      // } //end of if






    //this.currentGame = this.hostService.getGameFromCode(roomcode);
    //this.currentPlayer = new Player(username, 0, 0, this.hostService.randomId(), false);
    //this.currentPlayer = newPlayer;
    //this.hostService.addPlayer(this.currentPlayer);    
    // this.currentGame.subscribe(data=>{
    //   this.playerList = this.hostService.getCurrentGamePlayerList(data["$key"]);
    // },
    //   function(err){
    //     console.log(err)
    //   },
    //   function(){
    //     this.playerList.push(newPlayer);
    //   })
    // this.playerList.push(newPlayer);
    //this.router.navigate(['student', roomcode, this.currentPlayer.id]);
    // https://stackoverflow.com/questions/39401228/get-child-of-firebaseobjectobservable-angularfire2
  }

  //Added by STZ
  snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
  };

}
