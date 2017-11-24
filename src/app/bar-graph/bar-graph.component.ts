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
        label: 'Answer Distribution',
        borderWidth: ["3","3","3","3"],
        borderColor: ['rgba(114,49,87,1)',
        'rgba(91,121,97,1)',
        'rgba(46,77,167,1)',
        'rgba(224,73,81,1)']
      }
    ];
  }

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    tooltips: { bodyFontSize: 18 },
    maintainAspectRatio: false,
    layout: {
      padding: {
          left: 25,
          right: 25,
          top: 0,
          bottom: 15
      }
    },
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero:true,
              fontSize: 26,
              fontStyle: 'bold',
              fontFamily: "'Acme', 'sans-serif'"
          },
          gridLines: {
            color: 'rgba(100,100,100,.2)',
            lineWidth: '1'
          },
          
      }],
      xAxes: [{
          display: false
      }]
    }
    
  };

  public barChartLabels:string[] = ['A', 'B', 'C', 'D'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = false;
  public barChartColor:Array<any> = [
    {
      backgroundColor: ['rgba(114,49,87,.6)',
      'rgba(91,121,97,.6)',
      'rgba(46,77,167,.6)',
      'rgba(224,73,81,.6)'
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
