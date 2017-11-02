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
  games: FirebaseListObservable<any[]>;
  questions: Question[];
  lastFiveGames;

  constructor(private router: Router, private hostService: HostService) { }

  ngOnInit() {
    this.questions = this.hostService.getQuestions();
    this.games = this.hostService.getGames();
    this.returnLastFiveGames();
  }

  startGame(clickedGame){
    this.router.navigate(['host', clickedGame.id]);
  }

  randomId(){
    return Math.floor(Math.random()*90000) + 10000;
  }

  // id: number
  // game_state: string
  // game_over: boolean
  // public player_list: Player[]
  //  public question_list: Question[]
  createGame(game){
    var newGame: Game = new Game(this.randomId(), "starting", false, [], this.questions);
    this.hostService.createGame(newGame);
  }

  //runs on init and returns the 5 most recently created game ids
  returnLastFiveGames(){
    var fiveGames = [];
    var gamesList;
    this.games.subscribe(data => {
      gamesList = data
      fiveGames = gamesList.slice(-5,)
      this.lastFiveGames = fiveGames
    })
  }
}
