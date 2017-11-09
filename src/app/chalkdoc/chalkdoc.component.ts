import { Component, OnInit } from '@angular/core';
import { Game } from '../game.model';
import { Question } from '../question.model';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HostService} from '../host.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-chalkdoc',
  templateUrl: './chalkdoc.component.html',
  styleUrls: ['./chalkdoc.component.css']
})
export class ChalkdocComponent implements OnInit {

  private id: string;
  private path: string;
  private quiz: Question[];

  constructor(private router: Router, private route: ActivatedRoute, private hostService: HostService) {
    
   }

  ngOnInit() {

    this.id = this.route.snapshot.params.id;
    this.path = this.route.snapshot.url[0].toString();
    console.log(" Id is: " + this.id);
    console.log(" Route is: " + this.path);

    this.hostService.getJSONQuestions(this.id)
    .then(result => {
      this.quiz = result;
      let roomCode = this.hostService.randomId();
      var newGame: Game = new Game(roomCode, "starting", false, [], this.quiz, this.quiz.length);
      console.log(result);
      this.hostService.createGame(newGame);
      this.router.navigate(['host', roomCode]);
      // this.router.navigate(['host', clickedGame.id]);
    })
    .catch(error => console.log(error));

  }

} 
