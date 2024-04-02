import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { IAHTLineGraph } from 'src/app/models/performance-dashboard/aht-line-graph';
import { SeriesData } from 'src/app/models/performance-dashboard/series-data';
import { IOutstandingChart } from 'src/app/models/performance-dashboard/statusSplitModel';

@Component({
  selector: 'app-aht-line-graph',
  templateUrl: './aht-line-graph.component.html',
  styleUrls: ['./aht-line-graph.component.scss']
})
export class AhtLineGraphComponent {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  
  @Input() graphDataSource : IAHTLineGraph = {} as IAHTLineGraph;
  

 constructor(){

 }

 ngOnChanges() {

  this.chartOptions = {

    chart: {

      type: 'line', // Use 'column' for vertical bar chart
      width:640

    },

   title: {

      text: 'AHT',
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

        text: 'AHT (Mins)',

      },

    },

    series: [

      {

        name: 'AHT',

        data: this.graphDataSource.aht as SeriesData[],

        color: '#337AB7'
       

      },

    ] as Highcharts.SeriesColumnOptions[],

    drilldown: {

      series: this.graphDataSource.drilldown as Highcharts.SeriesColumnOptions[]
   

    },

    exporting: {

      enabled: true,

      buttons: {

        contextButton: {

          menuItems: Highcharts.getOptions()?.exporting?.buttons?.contextButton?.menuItems?.filter(

            (item: string) => item !== 'printChart'

          ),

        },

      },

      csv: {

        dateFormat: '%Y-%m-%d',

        itemDelimiter: ',',

      },

    },

  }
}

 

 
}
