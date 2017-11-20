import { Component, OnInit, Input } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { HostService} from '../host.service';
import { StudentService } from '../student.service';
import { Question } from '../question.model';

@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.css'],
  providers: [HostService, StudentService]
})
export class BarGraphComponent implements OnInit {
  @Input() thisQuestion;
  playerChoices = [];
  public barChartData:any[]

  constructor() { }

  ngOnInit() {
    this.playerChoices = this.thisQuestion.player_choices;
    this.barChartData = [
      {
        data: this.playerChoices,
        label: 'Answer Distribution'
      }
    ];
  }

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    fontSize: 24
                }
                
            }]
        }
  };

  public barChartLabels:string[] = ['A', 'B', 'C', 'D'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  public barChartColor:Array<any> = [
    {
      backgroundColor: ['rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
    ]
    }
  ]

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }
}
