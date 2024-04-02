import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { ICategory } from 'src/app/models/common/category';
import { ISubCategory } from 'src/app/models/common/subcategory';
import { CommonService } from 'src/app/services/common.service';
import * as Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
import ExportingData from 'highcharts/modules/export-data';
import Exporting from 'highcharts/modules/exporting';
import { PerformanceDashboardService } from 'src/app/services/performance-dashboard.service';
import { IOutstandingChart } from 'src/app/models/performance-dashboard/statusSplitModel';
import { IReceivedVsCompletedChart } from 'src/app/models/performance-dashboard/receivedVsCompleted';
import { ISLABreakDownChart } from 'src/app/models/performance-dashboard/slaBreakdownModel';
import { ISLALineGraph } from 'src/app/models/performance-dashboard/slalinegraph';
import { IHoursBarGraph } from 'src/app/models/performance-dashboard/hours-bar-graph';
import { IAHTLineGraph } from 'src/app/models/performance-dashboard/aht-line-graph';

import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
Drilldown(Highcharts);

ExportingData(Highcharts);

Exporting(Highcharts);

Drilldown(Highcharts);




@Component({
  selector: 'app-performance-dashboard',
  templateUrl: './performance-dashboard.component.html',
  styleUrls: ['./performance-dashboard.component.scss'],
 // encapsulation: ViewEncapsulation.None
})

export class PerformanceDashboardComponent {
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions!: Highcharts.Options;
  categories: ICategory[];
  subcategories: ISubCategory[];
  emailInbox: number;
  emailInboxCategory: number;
  month: any;
  year: any;
  receivedCount: number=0;
  completedCount: number = 0;
  outstandingCount: number = 0;
  overallSLA: number = 0;
  totalActualAHT: number = 0;
  totalAHTSeconds: number = 0;
  totalAHTWorkIds: number = 0;
  isLoading: boolean = false;
  months: string[] = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'long' }));

  outstandingGraph: IOutstandingChart = {} as IOutstandingChart;

  recievedVsCompletedGraph: IReceivedVsCompletedChart = {} as IReceivedVsCompletedChart;


  hoursGraph: IHoursBarGraph = {} as IHoursBarGraph;
  ahtLineGraph: IAHTLineGraph = {} as IAHTLineGraph;



  slaBreakDownGraph: ISLABreakDownChart = {} as ISLABreakDownChart;

  slaLineGraph: ISLALineGraph = {} as ISLALineGraph;
  averageAHT:number;

  constructor(private _performanceService: PerformanceDashboardService, private _commonService: CommonService) {

  }

  ngOnInit() {

    this.month = 0;
    this.year = new Date().getFullYear();
    this.getCategories();
    this.loadOutstandingGraph('Year');
    this.loadRecivedVsCompletedGraph('Year');
    this.loadHoursGraph('Year');
    this.loadAHTGraph('Year');
    this.loadSLABreakDownGraph('Year');
    this.loadSLALineGraph('Year');

    this.emailInbox=0;
   

  }

  // Load email inbox
  getCategories() {
    this._commonService.getCategories().subscribe(result => {
      this.categories = result;
    })
  }

  // load email inbox category
  getSubCategories(categoryId: number) {
    categoryId = categoryId == undefined ? 0 : categoryId;
    this._commonService.getSubCategories(categoryId).subscribe(result => {
      this.subcategories = result;
    })
  }


  // Email inbox change event
  emailInboxChange(categoryId: any) {
    this.emailInboxCategory = 0;

    this._commonService.getSubCategories(categoryId).subscribe(result => {
      this.subcategories = result;
    });

  }

  // email inbox change event
  emailInboxCategoryChange() {

  }

  // Get year 
  getYearRange(): number[] {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1];
  }

  // Update graph
  updateGraph(): void {
    this.loadOutstandingGraph('Range');
    this.loadRecivedVsCompletedGraph('Range');
    this.loadSLABreakDownGraph('Range');
    this.loadSLALineGraph('Range');
  }

updateGraphYear():void{
    this.loadOutstandingGraph('Year');
    this.loadRecivedVsCompletedGraph('Year');
    this.loadSLABreakDownGraph('Year');
    this.loadSLALineGraph('Year');
    this.loadAHTGraph('Year');
    this.loadHoursGraph('Year');
  }

  // Load outstanding graph
  loadOutstandingGraph(filterType: string) {
    this.isLoading = true;
    this._performanceService.getOutstaningGraph(this.year, this.month, filterType, 0, 0).subscribe(result => {
      this.outstandingGraph = result;
      //console.log('Outstanding', this.outstandingGraph);

      let outstandingCount = 0;
      if (this.outstandingGraph && this.outstandingGraph.data && this.outstandingGraph.data.length > 0) {
        outstandingCount = this.outstandingGraph.data.reduce((total, monthData) => {
          if (monthData && typeof monthData.y === 'number') {
            return total + monthData.y;
          } else {
            return total;
          }
        }, 0);
      }

      this.outstandingCount = outstandingCount;
      this.isLoading = false;
    });
  }


  //Get RecivedVsCompleted Graph
  loadRecivedVsCompletedGraph(filterType: string) {
    this.isLoading = true;
    this._performanceService.getReceivedVsCompletedData(this.year, this.month, filterType, 0, 0).subscribe(result => {
      this.recievedVsCompletedGraph = result;
      // console.log(this.recievedVsCompletedGraph);

      if (this.recievedVsCompletedGraph) {
        let receivedCount = 0;
        let completedCount = 0;

        if (this.recievedVsCompletedGraph.receivedData) {
          receivedCount = this.recievedVsCompletedGraph.receivedData.reduce((total, item) => {
            return total + item.y;
          }, 0);
        }

        if (this.recievedVsCompletedGraph.completedData) {
          completedCount = this.recievedVsCompletedGraph.completedData.reduce((total, item) => {
            return total + item.y;
          }, 0);
        }

        this.receivedCount = receivedCount;
        this.completedCount = completedCount;
      } else {
        this.receivedCount = 0;
        this.completedCount = 0;
      }

      // console.log(this.completedCount);
      this.isLoading = false;
    });
  }


  // Get SLABreakDownGraph
  loadSLABreakDownGraph(filterType: string) {
    this.isLoading = false;
    this._performanceService.getSLABreakdown(this.year, this.month, filterType, 0, 0).subscribe(result => {
      this.slaBreakDownGraph = result;
      this.isLoading = false;
    })

  }


  // Get SLALineGraph
  loadSLALineGraph(filterType: string) {

    this._performanceService.getSLAData(this.year, this.month, filterType, 0, 0).subscribe(result => {
      this.slaLineGraph = result;
      //console.log('SLA', this.slaLineGraph);
      if (this.slaLineGraph && this.slaLineGraph.data && this.slaLineGraph.data.length > 0) {
        let totalSLA = 0;
        let count = 0;
        this.slaLineGraph.data.forEach(monthData => {

          if (monthData && typeof monthData.y === 'number') {
            totalSLA += monthData.y;
            count++;
          }
        });
        if (count > 0) {
          this.overallSLA = totalSLA / count;
        } else {
          this.overallSLA = 0;
        }
      } else {
        this.overallSLA = 0;
      }
    })

  }


  // Get Hours Graph
  loadHoursGraph(filterType: string) {

    this._performanceService.getHours(this.year, this.month, filterType, 0, 0).subscribe(result => {
      this.hoursGraph = result;
    })

  }


  // Get AHT graph
  loadAHTGraph(filterType: string) {
    this._performanceService.getAHT(this.year, this.month, filterType, 0, 0).subscribe(result => {
        this.ahtLineGraph = result;
 
        if (this.ahtLineGraph && this.ahtLineGraph.aht && this.ahtLineGraph.aht.length > 0) {
 
            let totalActualAHT = 0;
            let totalAHTSeconds = 0;
            let totalAHTWorkIds = 0;
 
            this.ahtLineGraph.aht.forEach(monthAHT => {
                if (monthAHT) {
                    totalActualAHT += monthAHT.actualAHT || 0;
                    totalAHTSeconds += monthAHT.totalAHTSeconds || 0;
                    totalAHTWorkIds += monthAHT.totalAHTWorkIds || 0;
                }
            });
 
            this.totalActualAHT = totalActualAHT;
            this.totalAHTSeconds = totalAHTSeconds;
            this.totalAHTWorkIds = totalAHTWorkIds;
 
            // Calculate average 'y' value
            const totalY = this.ahtLineGraph.aht.reduce((sum, entry) => sum + entry.y, 0);
            this.averageAHT = totalY / this.ahtLineGraph.aht.length;
        } else {
            this.totalActualAHT = 0;
            this.totalAHTSeconds = 0;
            this.totalAHTWorkIds = 0;
            this.averageAHT = 0;
        }
    });
}

}

