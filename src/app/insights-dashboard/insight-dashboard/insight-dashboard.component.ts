import { Component, OnInit, AfterViewInit } from '@angular/core';
import Drilldown from 'highcharts/modules/drilldown';
import HC_exportData from 'highcharts/modules/export-data';
import HC_exporting from 'highcharts/modules/exporting';
import * as Highcharts from 'highcharts';
import { ICategory } from 'src/app/models/common/category';
import { ISubCategory } from 'src/app/models/common/subcategory';
import { CommonService } from 'src/app/services/common.service';
import { InsightDashboardService } from 'src/app/services/insight-dashboard.service';
import { FormsModule } from '@angular/forms';
import { ITopCustomer } from 'src/app/models/insights-dashboard/top-customers';
import { ITopCustomerDrilldown } from 'src/app/models/insights-dashboard/top-customers';
import { IEmailreceived } from 'src/app/models/insights-dashboard/emailreceived';
import type { Options } from 'highcharts';
import { IAverageDays } from 'src/app/models/insights-dashboard/averagedays';
import { IEmailSentiments } from 'src/app/models/insights-dashboard/emailsentiments';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
Drilldown(Highcharts);

interface ChartDataItem {
  label: string;
  value: number;
}
interface EmailSentimentSubcategory {
  0: string;
  1: number;
  2: number;
  3: number;
}
HC_exporting(Highcharts);
HC_exportData(Highcharts);
@Component({
  selector: 'app-insight-dashboard',
  templateUrl: './insight-dashboard.component.html',
  styleUrls: ['./insight-dashboard.component.scss']
})
export class InsightDashboardComponent implements OnInit, AfterViewInit {
  private chart: Highcharts.Chart | undefined;
  emailInboxCategory: any = 0;
  month: number = 0;
  year: number = 2022;
  emailInbox: any = 0;
  inboxCategory: any;
  categories: ICategory[];
  subcategories: ISubCategory[];
  Highcharts: typeof Highcharts = Highcharts;
  chartData: IAverageDays[] = [];
  chartOptions: Highcharts.Options = {};
  chartOptionsAverageDays: Highcharts.Options = {};
  //chartOptionsSentiment: Highcharts.Options = {};
  chartOptionsEmailreceived: Highcharts.Options = {};
  chartOptionsTopCustomer: Highcharts.Options = {};
  chartOptionsSentiment: Highcharts.Options = {};
  isLoading: boolean = false;
  months: string[] = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'long' }));
  getYearRange(): number[] {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1];
  }
  constructor(private _commonservice: CommonService, private _insightdashboard: InsightDashboardService) {

  }

  ngOnInit(): void {
    this.year = new Date().getFullYear();
    this.contactTypeData();
    this.getCategories();
    this.getSubCategories(this.emailInbox);
    this.getTopCustomerData();
    this.emailReceivedInbox();
    this.getAverageDaysData();
    this.emailInboxSentimentsData();

    this.emailInbox=0;

  }

  ngAfterViewInit(): void {
    this.createContactTypeChart();
  }

  emailInboxSentimentsData(): void {
    this.isLoading = true;
    this._insightdashboard.getEmailInboxSentimentsData(this.year, this.month, this.emailInbox, this.emailInboxCategory)
      .subscribe(data => {
        console.log('sentiments Data:', data);
        this.updateEmailSentimentsChart(data);
        this.createEmailSentimentsChart();
        this.isLoading = false;
      });
  }
  updateEmailSentimentsChart(apiData: any[]): void {
    const seriesData: Highcharts.SeriesOptionsType[] = [];
    const drilldownSeries: Highcharts.SeriesOptionsType[] = [];

    ['Positive', 'Negative', 'Neutral'].forEach(sentiment => {
      const sentimentSeries: Highcharts.SeriesOptionsType = {
        type: 'line',
        name: sentiment,
        data: apiData.map(item => ({
          name: item.category,
          y: item[`${sentiment.toLowerCase()}PercentageByCategory`],
          drilldown: `${item.category}-${sentiment}`
        })),
        marker: {
          symbol: 'circle'
        }
      };

      seriesData.push(sentimentSeries);
    });

    apiData.forEach(item => {
      ['Positive', 'Negative', 'Neutral'].forEach(sentiment => {
        const subcatDrilldown = item.emailSentimentbySubcat.map((subcat: any) => ({
          name: subcat[0],
          y: subcat[sentiment === 'Positive' ? 1 : sentiment === 'Negative' ? 2 : 3], // Sentiment percentage
        }));

        const sentimentDrilldown: Highcharts.SeriesOptionsType = {
          type: 'line',
          id: `${item.category}-${sentiment}`,
          name: sentiment,
          data: subcatDrilldown,
          marker: {
            symbol: 'circle'
          }
        };

        drilldownSeries.push(sentimentDrilldown);
      });
    });

    this.chartOptionsSentiment = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Email Inbox - Sentiment',
        style: {
          fontSize: '14px',
          fontWeight: 'bold'
        }
      },
      "credits": {
        "enabled": false
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadCSV',
              'downloadJPEG',
              'downloadPNG',
              'downloadPDF',
              'downloadSVG',
              'separator',
              'downloadXLS',
              'viewData'
            ]
          }
        }
      },
      xAxis: {
        type: 'category',
        crosshair: true
      },
      yAxis: {
        title: {
          text: 'Percentages',
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
            format: '<span style="color:black;text-decoration: underline;text-decoration-color: black">{point.y:.2f}</span>'
          }
        }
      },
      series: seriesData,
      drilldown: {
        series: drilldownSeries
      }
    };
  }

  createEmailSentimentsChart(): void {
    const container = document.getElementById('emailSentimentsChart');
    if (container) {
      setTimeout(() => {
        Highcharts.chart(container, this.chartOptionsSentiment);
      }, 0);
    }
  }

  contactTypeData(): void {
    this.isLoading = true;
    this._insightdashboard.getContactTypeData(this.year, this.month, this.emailInbox, this.emailInboxCategory)
      .subscribe(data => {
        console.log('API Data:', data);
        this.updateContactTypeChart(data);
        this.createContactTypeChart();
        this.isLoading = false;
      });
  }

  updateContactTypeChart(apiData: any[]): void {
    const drilldownSeries: any[] = [];

    apiData.forEach(item => {
      const drilldownItem = {
        type: 'pie',
        id: item.contactType.toLowerCase(),
        name: item.contactType,
        data: item.data.map((d: any) => [d[0], d[1]])
      };
      drilldownSeries.push(drilldownItem);

    });

    this.chartOptions = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Contact Type',
        style: {
          fontSize: '14px',
          fontWeight: 'bold'
        }
      },
      "credits": {
        "enabled": false
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadCSV',
              'downloadJPEG',
              'downloadPNG',
              'downloadPDF',
              'downloadSVG',
              'separator',
              'downloadXLS',
              'viewData'
            ]
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Contact Type',
        data: apiData.map(item => ({
          name: item.contactType,
          y: item.percentage,
          drilldown: item.contactType.toLowerCase()
        })),
      }],
      drilldown: {
        series: drilldownSeries
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            style: {
              color: '#000000',
              fill: ''
            },
            format: '<span style="color:black;text-decoration: underline;text-decoration-color: black">{point.name}: {point.percentage:.2f} %</span>',
          }
        }
      }

    };


    if (this.chart) {
      this.chart.update(this.chartOptions, true);
      this.chart.redraw();
    }
  }

  createContactTypeChart(): void {
    const container = document.getElementById('contctType');
    if (container) {
      setTimeout(() => {
        Highcharts.chart(container, this.chartOptions);
      }, 0);
    }
  }
  getTopCustomerData(): void {
    this.isLoading = true;
    this._insightdashboard.getTopCustomerData(this.year, this.month, this.emailInbox, this.emailInboxCategory)
      .subscribe(data => {
        this.updateTopCustomerChart(data.topCustomers, data.topCustomersDrillDown);
        this.createTopCustomerChart();
        this.isLoading = false;
      });
  }
  updateTopCustomerChart(topCustomers: ITopCustomer[], topCustomersDrillDown: ITopCustomerDrilldown[]): void {
    const drilldownSeries: any[] = [];

    topCustomersDrillDown.forEach(item => {
      const drilldownItem = {
        id: item.drillDownId.toLowerCase(),
        name: item.customerEmail,
        data: item.drilldownData.map((d: any) => ({
          name: d[0],
          y: d[1],
          emailCount: d[1]
        }))
      };
      drilldownSeries.push(drilldownItem);
    });

    this.chartOptionsTopCustomer = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Top Customers',
        style: {
          fontSize: '14px',
          fontWeight: 'bold'
        }
      },
      "credits": {
        "enabled": false
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadCSV',
              'downloadJPEG',
              'downloadPNG',
              'downloadPDF',
              'downloadSVG',
              'separator',
              'downloadXLS',
              'viewData'
            ]
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Top Customers',
        data: topCustomers.map(item => ({
          name: item.customerEmail,
          y: item.emailCount,
          emailCount: item.emailCount,
          drilldown: item.drilldownId.toLowerCase()
        }))
      }],
      drilldown: {
        series: drilldownSeries
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<span style="color:black;text-decoration: underline;text-decoration-color: black">{point.name}</b>: {point.emailCount}</span>'
          }
        }
      },
    };
    if (this.chart) {
      this.chart.update(this.chartOptionsTopCustomer, true);
    }
  }
  createTopCustomerChart(): void {
    const container = document.getElementById('topcustomer');
    if (container) {
      setTimeout(() => {
        Highcharts.chart(container, this.chartOptionsTopCustomer);
      }, 0);
    }
  }
  emailReceivedInbox(): void {
    this.isLoading = true;
    this._insightdashboard.getEmailReceivedInboxData(this.year, this.month, this.emailInbox, this.emailInboxCategory)
      .subscribe(data => {
        //console.log('API Data:', data);
        this.updateEmailReceivedChart(data);
        this.createEmailReceivedChart();
        this.isLoading = false;
      });
  }
  updateEmailReceivedChart(apiData: any[]): void {
    const drilldownSeries: any[] = [];

    apiData.forEach(item => {
      const drilldownItem = {
        type: 'pie',
        id: item.category.toLowerCase(),
        name: item.category,
        data: item.dataemail.map((d: any) => ({
          name: d[0],
          y: d[1]
        }))
      };

      drilldownSeries.push(drilldownItem);

    });

    this.chartOptionsEmailreceived = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Email Received-Inbox',
        style: {
          fontSize: '14px',
          fontWeight: 'bold'
        }
      },
      "credits": {
        "enabled": false
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadCSV',
              'downloadJPEG',
              'downloadPNG',
              'downloadPDF',
              'downloadSVG',
              'separator',
              'downloadXLS',
              'viewData'
            ]
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Category',
        data: apiData.map(item => ({
          name: item.category,
          y: item.categoryCount,
          drilldown: item.category.toLowerCase()
        }))
      }],
      drilldown: {
        series: drilldownSeries
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<span style="color:black;text-decoration: underline;text-decoration-color: black">{point.name}</b>: {point.y}</span>'
          }
        }
      }
    };


    if (this.chart) {
      this.chart.update(this.chartOptionsEmailreceived, true);
    }
  }

  createEmailReceivedChart(): void {
    const container = document.getElementById('emailreceivedinbox');
    if (container) {
      setTimeout(() => {
        Highcharts.chart(container, this.chartOptionsEmailreceived);
      }, 0);
    }
  }
  getSubCategories(categoryId: number) {
    categoryId = categoryId == undefined ? 0 : categoryId;
    this._commonservice.getSubCategories(categoryId).subscribe(result => {
      this.subcategories = result;
      this.updateContactTypeChart(result);
      this.createContactTypeChart();
    });
  }

  getCategories() {
    this._commonservice.getCategories().subscribe(result => {
      // console.log(result);
      this.categories = result;
      this.contactTypeData();
      this.getTopCustomerData();
      this.getAverageDaysData();
      this.emailReceivedInbox();
      this.emailInboxSentimentsData();

    })
  }
  emailInboxChange(categoryId: any) {
    this.emailInboxCategory = 0;
    this._commonservice.getSubCategories(categoryId).subscribe(result => {
      this.subcategories = result;
    });

  }
  emailInboxCategoryChange() {
    this.contactTypeData();
    this.getTopCustomerData();
    this.getAverageDaysData();
    this.emailReceivedInbox();
    this.emailInboxSentimentsData();
  }
  onFilterChange(): void {
    this.contactTypeData();
    this.getTopCustomerData();
    this.emailReceivedInbox();
    this.getAverageDaysData();
    this.emailInboxSentimentsData();
  }
  getAverageDaysData(): void {
    this.isLoading = true;
    this._insightdashboard.getAverageDaysData(this.year, this.month, this.emailInbox, this.emailInboxCategory)
      .subscribe((data: IAverageDays[]) => {
        //console.log('Average days Data:', data);
        this.updateAverageDaysChart(data);
        this.createAverageDaysChart();
        this.isLoading = false;
      });
  }
  updateAverageDaysChart(apiData: any[]): void {
    const drilldownSeries: any[] = [];

    apiData.forEach(item => {
      const drilldownItem = {
        type: 'line',
        id: item.category.toLowerCase(),
        name: item.category,
        data: item.data.map((d: any) => [d[0], d[1]])
      };
      drilldownSeries.push(drilldownItem);
    });


    this.chartOptionsAverageDays = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Average Days (First Contact)',
        style: {
          fontSize: '14px',
          fontWeight: 'bold'
        }
      },
      "credits": {
        "enabled": false
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Days'
        }
      },
      series: [{
        type: 'line',
        name: 'Average Days',
        data: apiData.map(item => ({
          name: item.category,
          y: item.avgDaysToRespond,
          drilldown: item.category.toLowerCase()
        }))
      }],
      drilldown: {
        series: drilldownSeries
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '<span style="color:black;text-decoration: underline;text-decoration-color: black;">{point.y}</span>'
          }
        }
      }

    };


    if (this.chart) {
      this.chart.update(this.chartOptionsAverageDays, true);
    }
  }

  createAverageDaysChart(): void {
    const container = document.getElementById('averagedays');
    if (container) {
      setTimeout(() => {
        Highcharts.chart(container, this.chartOptionsAverageDays);
      }, 0);
    }
  }

}
