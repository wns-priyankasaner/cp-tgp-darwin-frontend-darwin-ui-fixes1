import { Component, Input, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';

import { IReceivedVsCompletedChart } from 'src/app/models/performance-dashboard/receivedVsCompleted';
import { SeriesData } from 'src/app/models/performance-dashboard/series-data';

@Component({
  selector: 'app-received-vs-completed',
  templateUrl: './received-vs-completed.component.html',
  styleUrls: ['./received-vs-completed.component.scss']
})
export class ReceivedVsCompletedComponent  {


  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  chart: any;
  @Input() graphDataSource : IReceivedVsCompletedChart = {} as IReceivedVsCompletedChart;
 
 
  ngOnChanges(changes: SimpleChanges) {

     this.chartOptions! =  {
      
 

      chart: {
  
        type: 'column',
        width: 640, // Set the width here, in pixels
  
      },
  
   
  
      plotOptions: {
  
        series: {
  
          stacking: 'normal'
  
        }
  
      },
  
      title: {
  
        text: 'Recieved Vs Completed',
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
        labels:{
          style:{
            color:'black',
            fill:'black'
          },
        
        }
      },
  
      yAxis: {
        gridLineWidth:0,
        title: {
  
          text: 'Count',
  
        },
  
      },
  
      series: [
  
        {
  
          type: 'column',
  
          name: 'Completed',
  
          data: this.graphDataSource.completedData as SeriesData[],
  
          color: '#337AB7'
  
        },
  
        {
  
          type: 'column',
  
          name: 'Received',
  
          data: this.graphDataSource.receivedData as SeriesData[],

          color: '#434348'
  
        }
  
      ],
      
      drilldown: {
  
        series:  this.graphDataSource.drilldown as any[] //Highcharts.SeriesColumnOptions[]
  
      }
      
  
    };
   
  }

  }





