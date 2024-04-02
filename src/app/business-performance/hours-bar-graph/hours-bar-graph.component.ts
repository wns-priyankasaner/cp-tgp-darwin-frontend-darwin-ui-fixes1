import { Component, Input, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { IHoursBarGraph } from 'src/app/models/performance-dashboard/hours-bar-graph';
import { IReceivedVsCompletedChart } from 'src/app/models/performance-dashboard/receivedVsCompleted';
import { SeriesData } from 'src/app/models/performance-dashboard/series-data';

@Component({
  selector: 'app-hours-bar-graph',
  templateUrl: './hours-bar-graph.component.html',
  styleUrls: ['./hours-bar-graph.component.scss']
})
export class HoursBarGraphComponent {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  @Input() graphDataSource : IHoursBarGraph = {} as IHoursBarGraph;


  constructor(){

  }


  ngOnChanges(changes: SimpleChanges) {

    this.chartOptions! =  {

 

      chart: {
  
        type: 'column',
        width:640
  
      },
  
   
  
      plotOptions: {
  
        series: {
  
          stacking: 'normal'
  
        }
  
      },
  
      title: {
  
        text: 'Hours',
        style: {
          fontSize: '14px',
          fontWeight:'bold'
        }
  
      },
      "credits": {
        "enabled": false
      },
      xAxis: {
  
        type: 'category',
  
      },
  
      yAxis: {

        gridLineWidth:0,
  
        title: {
  
          text: 'Total Case Count',
          
  
        },
  
      },
  
      series: [
  
        {
  
          type: 'column',
  
          name: 'Productive',
  
          data: this.graphDataSource.productive as SeriesData[],
  
          color: '#337AB7'
  
        },
  
        {
  
          type: 'column',
  
          name: 'Non Productive',
  
          data: this.graphDataSource.nonProductive as SeriesData[],
  
        }
  
      ],
  
   
  
      drilldown: {
  
        series:  this.graphDataSource.drilldown as any[] //Highcharts.SeriesColumnOptions[]
  
      }
  
    };
  

  }

}
