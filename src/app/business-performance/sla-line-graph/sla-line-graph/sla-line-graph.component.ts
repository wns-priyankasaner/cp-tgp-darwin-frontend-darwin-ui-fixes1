import { Component, Input, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ISLALineGraph } from 'src/app/models/performance-dashboard/slalinegraph';


interface SeriesData {

  name: string;

  y: number;

  drilldown?: string;

}


@Component({
  selector: 'app-sla-line-graph',
  templateUrl: './sla-line-graph.component.html',
  styleUrls: ['./sla-line-graph.component.scss']
})
export class SlaLineGraphComponent {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  
  @Input() slaLineGraph : ISLALineGraph = {} as ISLALineGraph;
  
  


  constructor() {

  }

  
  ngOnInit() {

    console.log('input')
    console.log(this.slaLineGraph)

    


  }

  ngOnChanges(changes: SimpleChanges) {



    this.chartOptions = {

      chart: {
  
        type: 'line', // Use 'column' for vertical bar chart
        width:640
  
      },
  
     title: {
  
        text: 'SLALine',
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
  
          text: 'SLA %',
  
        },
  
      },
  
      series: [
  
        {
  
          name: 'SLALine',
  
          data: this.slaLineGraph.data as SeriesData[],

          color: '#337AB7'
         
  
        },
  
      ] as Highcharts.SeriesLineOptions[],
  
      drilldown: {
  
        series: this.slaLineGraph.drilldown as Highcharts.SeriesLineOptions[]
     
  
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
