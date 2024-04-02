import { Component, Input, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ISLABreakDownChart } from 'src/app/models/performance-dashboard/slaBreakdownModel';




interface SeriesData {

  name: string;

  y: number;

  drilldown?: string;

}

@Component({
  selector: 'app-slabreakdown-bar-graph',
  templateUrl: './slabreakdown-bar-graph.component.html',
  styleUrls: ['./slabreakdown-bar-graph.component.scss']
})
export class SlabreakdownBarGraphComponent {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  
  @Input() slaBreakDownGraph : ISLABreakDownChart = {} as ISLABreakDownChart;
  
  


  constructor() {

  }

  
  ngOnInit() {

    console.log('input')
    console.log(this.slaBreakDownGraph)

    


  }

  ngOnChanges(changes: SimpleChanges) {



    this.chartOptions = {

      chart: {
  
        type: 'column', // Use 'column' for vertical bar chart
          width:640
      },
  
     title: {
  
        text: 'SLABreakDown',
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
  
          text: 'SLA',
  
        },
  
      },
  
      series: [
  
        {
  
          name: 'SLABreakDown',
  
          data: this.slaBreakDownGraph.data as SeriesData[],

          color: '#337AB7'
         
  
        },
  
      ] as Highcharts.SeriesColumnOptions[],
  
      drilldown: {
  
        series: this.slaBreakDownGraph.drilldown as Highcharts.SeriesColumnOptions[]
     
  
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
