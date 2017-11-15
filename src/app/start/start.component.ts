import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2/database';
import { Game } from '../game.model';
import { Question } from '../question.model';
import { HostService } from '../host.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
  providers: [HostService]
})

export class StartComponent implements OnInit {
  //games: FirebaseListObservable<Game[]>;
  questions: Question[];
  lastFiveGames: Game[] ;

  constructor(private router: Router, private hostService: HostService) { }

  ngOnInit() {
    // Load example questions
    // TODO: Remove this button, as these are just test questions
    this.questions = this.hostService.getQuestions();
    
    // Get a list of the last 5 games
    this.hostService.getGames()
      .subscribe(games => {
        this.lastFiveGames = games.slice(-5,);
      })
    //this.returnLastFiveGames();
  }

  startGame(clickedGame){
    this.router.navigate(['host', clickedGame.id]);
  }

  createGame(game){
    this.router.navigate(['chalkdoc', '123456789']);
  }

  //runs on init and returns the 5 most recently created game ids
  // returnLastFiveGames(){
  //   var fiveGames = [];
  //   var gamesList;
  //   this.games.subscribe(data => {
  //     gamesList = this.snapshotToArray(data)
  //     fiveGames = gamesList.slice(-5,)
  //     this.lastFiveGames = fiveGames
  //   })
  // }

}
