import { Component, Input, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { SeriesData } from 'src/app/models/performance-dashboard/series-data';
import { IOutstandingChart } from 'src/app/models/performance-dashboard/statusSplitModel';
import { CommonService } from 'src/app/services/common.service';
import { PerformanceDashboardService } from 'src/app/services/performance-dashboard.service';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';


@Component({
  selector: 'app-outstanding-bar-graph',
  templateUrl: './outstanding-bar-graph.component.html',
  styleUrls: ['./outstanding-bar-graph.component.scss']
})
export class OutstandingBarGraphComponent {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  
  @Input() outstandingGraph : IOutstandingChart = {} as IOutstandingChart;
  
  


  constructor() {

  }

  
  ngOnInit() {

    console.log('input')
    console.log(this.outstandingGraph)

  }

  ngOnChanges(changes: SimpleChanges) {



    this.chartOptions = {

      chart: {
  
        type: 'column', // Use 'column' for vertical bar chart
        width: 640, // Set the width here, in pixels
      },
  
     title: {
  
        text: 'Outstanding',
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
  
          name: 'Outstanding',
  
          data: this.outstandingGraph.data as SeriesData[],

          color: '#337AB7'
         
  
        },
  
      ] as Highcharts.SeriesColumnOptions[],
  
      drilldown: {
  
        series: this.outstandingGraph.drilldown as Highcharts.SeriesColumnOptions[]
     
  
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
