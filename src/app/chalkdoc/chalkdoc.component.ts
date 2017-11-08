import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
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
  private quiz: Object;

  constructor(private route: ActivatedRoute, private http: Http) {
    
   }

  ngOnInit() {

    this.id = this.route.snapshot.params.id;
    this.path = this.route.snapshot.url[0].toString();
    console.log(" Id is: " + this.id);
    console.log(" Route is: " + this.path);

    this.getJSON(this.id).subscribe(data => {
      this.quiz=data;
      console.log("data found: " + JSON.stringify(this.quiz));
    }, error => {
      console.log(error)
    });

  }

  public getJSON(id: string): Observable<any> {
    return this.http.get("./assets/chalkdoc/"+ id + ".json")
                    .map((res:any) => res.json())
                    .catch((error:any) => {
                      console.log(error)
                      return error;
                    });
  }
} 
