import { DatePipe, Time, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ngxCsv } from 'ngx-csv';
import { timeout } from 'rxjs';
import { ICategory } from 'src/app/models/common/category';
import { ISubCategory } from 'src/app/models/common/subcategory';
import { IAgentLivePerformance } from 'src/app/models/tabular-dashboard/agentliveperformance';
import { IAgentPerformance } from 'src/app/models/tabular-dashboard/agentperformance';
import { IProcessPerformance } from 'src/app/models/tabular-dashboard/processperformance';
import { ISLA } from 'src/app/models/tabular-dashboard/sla';
import { CommonService } from 'src/app/services/common.service';
import { TabularDataService } from 'src/app/services/tabular-data.service';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import { catchError } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';


const ELEMENT_DATA: IAgentLivePerformance[] = [

];
const AGENT_DATA: IAgentPerformance[] = [

];
const SLA_DATA: ISLA[] = [

];
const Process_DATA: IProcessPerformance[] = [

];

@Component({
  selector: 'app-tabular-data-extract',
  templateUrl: './tabular-data-extract.component.html',
  styleUrls: ['./tabular-data-extract.component.scss']
})
export class TabularDataExtractComponent implements OnInit {
  displayedColumns: string[] = ['EmpName', 'TEUsername', 'AgentStatus', 'LoggedInStatus', 'Productive', 'NonProductive', 'AHT', 'TotalScore', 'ForwardedCount', 'QueryCount', 'QueryCompleted', 'NFACount', 'RequestFurtherInfoOther', 'Others', 'NFAJunkSPAMemail', 'FutureDate', 'QueryCompletedNFA', 'SupportEscalation'];
  displayedAgent: string[] = ['EmpName', 'TEUsername', 'Category', 'AHT', 'TotalScore', 'ForwardedCount', 'QueryCount', 'QueryCompleted', 'NFACount', 'RequestFurtherInfoOther', 'Others', 'NFAJunkSPAMemail', 'FutureDate', 'QueryCompletedNFA', 'SupportEscalation'];
  displayedSLA: string[] = ['Category', 'SLA'];
  displayedProcess: string[] = ['Category', 'Received', 'Attempted', 'Unattempted', 'AHT', 'ForwardedCount', 'QueryCount', 'QueryCompleted', 'NFACount', 'RequestFurtherInfoOther', 'Others', 'NFAJunkSPAMemail', 'FutureDate', 'QueryCompletedNFA', 'SupportEscalation'];
  emailInbox: number;
  emailInboxCategory: number;
  emailInboxAgent: any;
  emailInboxCategoryAgent: any;
  emailInboxSLA: any;
  emailInboxCategorySLA: any;
  emailInboxProcess: any;
  emailInboxCategoryProcess: any;
  categories: ICategory[];
  subcategories: ISubCategory[];
  startDate: any;
  endDate: any;
  startDateSLA: any;
  endDateSLA: any;
  startDateProcess: any;
  endDateProcess: any;
  activePageDataChunk: IAgentLivePerformance[];
  activePageDataChunkagent: IAgentPerformance[];
  dataSource: IAgentLivePerformance[] = [];
  dataAgent: IAgentPerformance[] = [];
  dataSLA: ISLA[] = [];
  dataProcess: IProcessPerformance[] = [];
  SLA_DATA: any[];
  ELEMENT_DATA: any[];
  AGENT_DATA: any[];
  Process_DATA: any[];
  isLoading:boolean=false;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  defaultStartDate:Date;
  defaultEndDate:Date;
  
  constructor(private _http: HttpClient, private _commonService: CommonService, private _tabularDashboardService: TabularDataService) {

  }

  ngOnInit() {
    this.ELEMENT_DATA = this.dataSource;
    this.AGENT_DATA = this.dataAgent;
    this.SLA_DATA = this.dataSLA;
    this.Process_DATA = this.dataProcess;
    //const date=new Date();
    //this.startDate=this.startDate?this.startDate:date.setMonth(date.getMonth()-1);
    //this.endDate=this.endDate?this.endDate:date;
    this.getCategories();
    this.getSubCategories(this.emailInbox);
    this.getAgentLivePerformance();
    this.getAgentClearence();
    this.getDashboardSla();
    this.getProcessClearance();
    // this.dateChanged(this.event);

       
    const currentDate =new Date();
    this.defaultStartDate= new Date(currentDate.getFullYear(),currentDate.getMonth(),1);
   this.defaultEndDate=currentDate;
   this.emailInbox=0;
   this.emailInboxAgent=0;
   this.emailInboxCategoryAgent=0;
   this.emailInboxSLA=0;
   this.emailInboxProcess=0;

   

  }

  // Get email inbox
  getCategories() {
    this._commonService.getCategories().subscribe(result => {
      // console.log(result);
      this.categories = result;
    })
  }

  // Get email inbox category
  getSubCategories(categoryId: number) {
    categoryId = categoryId == undefined ? 0 : categoryId;
    this._commonService.getSubCategories(categoryId).subscribe(result => {

      //  console.log(result);
      this.subcategories = result;

    })
  }


  // page changes
  onPageChanged(e: any) {
    if (this.dataSource) {
      const firstCut = e.pageIndex * e.pageSize;
      const secondCut = firstCut + e.pageSize;
      //this.dataSource = this.dataSource.slice(firstCut, secondCut);
      this.activePageDataChunk = this.dataSource.slice(firstCut, secondCut);
      
    }
  }

  // Email inbox change for agent live performance
  emailInboxChange(categoryId: any) {
    this.emailInboxCategory = 0;
    
    this.getAgentLivePerformance();
   
    this._commonService.getSubCategories(categoryId).subscribe(result => {
      this.subcategories = result;
    });

  }

  // Email inbox category changes
  emailInboxCategoryChange() {
    this.getAgentLivePerformance();
    this.getAgentClearence();
    this.getDashboardSla();
    this.getProcessClearance();
  }


  // Email Inbox change event for agent performnace
  emailInboxAgentProcess(categoryId: any) {
    this.emailInboxCategoryAgent = 0;
    
    this.getAgentClearence();
    
    this._commonService.getSubCategories(categoryId).subscribe(result => {
      this.subcategories = result;
    });

  }
  
  // Email Inbox category change event for agent performance
  emailInboxCategoryAgentProcess() {
    this.getAgentClearence();
  }

  // Email inbox change event for SLA
emailInboxSLAs(categoryId: any) {
    this.emailInboxCategorySLA = 0;
    
    this.getDashboardSla();
    
    this._commonService.getSubCategories(categoryId).subscribe(result => {
      this.subcategories = result;
    });

  }
  
  // Email inbox category change event for SLA
  emailInboxCategorySLAs() {
    this.getDashboardSla();
  }
 

  // Email inbox change event for process performance
  emailInboxChangeProcess(categoryId: any) {
    this.emailInboxCategoryProcess = 0;
    
    this.getProcessClearance();
    
    this._commonService.getSubCategories(categoryId).subscribe(result => {
      this.subcategories = result;
    });

  }


  // Email inbox category change event for process performance
  emailInboxCategoryChangeProcess() {
    this.getProcessClearance();
  }

  // Date change event for agent performance
  dateChanged(startDate:any,endDate:any) {

      this.startDate=startDate.value;
      this.endDate=endDate.value;
   
    this.getAgentClearence();
  
  }

  // Date change event for SLA
  dateChangeSLA(startDate:any,endDate:any) {

    this.startDate=startDate.value;
    this.endDate=endDate.value;
  
 this.getDashboardSla();
}

// Date change event for process performance
dateChangeProcess(startDate:any,endDate:any) {

  this.startDate=startDate.value;
  this.endDate=endDate.value;

this.getProcessClearance();
}

getAHTColorClass(element: any) {
  if (element.aht < 7) {
    return 'green-class'; // CSS class for green color
  } else if (element.aht <= 8) {
    return 'yellow-class'; // CSS class for yellow color
  } else {
    return 'red-class'; // CSS class for red color
  }
}


// Get live agent email processed

public getAgentLivePerformance() {
  this.isLoading = true;

  this.emailInbox = this.emailInbox === undefined ? 0 : this.emailInbox;
  this.emailInboxCategory = this.emailInboxCategory === undefined ? 0 : this.emailInboxCategory;

  this._tabularDashboardService.getAgentLivePerformance(this.emailInbox, this.emailInboxCategory)
    .subscribe(
      result => {
        this.dataSource = result;
        this.onPageChanged({pageIndex:this.pageIndex,pageSize:this.pageSize});
        this.isLoading = false;
      },
      error => {
        console.error('Error:', error);
        this.isLoading = false;
      }
    );
}

// Get agent performance email processed
  public getAgentClearence() {

    this.isLoading = true;
    this.emailInboxAgent = this.emailInboxAgent === undefined ? 0 : this.emailInboxAgent;
    this.emailInboxCategoryAgent = this.emailInboxCategoryAgent === undefined ? 0 : this.emailInboxCategoryAgent;
    const date=new Date();
    const agentSDate=this.startDate?this.startDate:date.setMonth(date.getMonth()-1);
    const agentEDate=this.endDate?this.endDate:date;
    
    const sdate = formatDate(agentSDate, 'yyyy-MM-dd', 'en-gb');
    const edate = formatDate(agentEDate, 'yyyy-MM-dd', 'en-gb');
    let isOrderDesc = true;
    this._tabularDashboardService.getAgentClearence(sdate, edate, this.emailInboxAgent, this.emailInboxCategoryAgent, isOrderDesc).subscribe(result => {
      this.dataAgent = result;
      this.onPageChanged({pageIndex:this.pageIndex,pageSize:this.pageSize});
      this.isLoading = false;
      // console.log("data source ", result);
    },
    error => {
      console.error('Error:', error);
      this.isLoading = false;
    }
    );

  }

  // Get sla status
  public getDashboardSla() {
    this.isLoading = true;
    let categoryId = 0;
    let subCategoryId = 0;
    this.emailInboxSLA = this.emailInboxSLA === undefined ? 0 : this.emailInboxSLA;
    this.emailInboxCategorySLA = this.emailInboxCategorySLA === undefined ? 0 : this.emailInboxCategorySLA;
    const date=new Date();
    const slaSDate=this.startDate?this.startDate:date.setMonth(date.getMonth()-1);
    const slaEDate=this.endDate?this.endDate:date;
    
    const sdate = formatDate(slaSDate, 'yyyy-MM-dd', 'en-gb');
    const edate = formatDate(slaEDate, 'yyyy-MM-dd', 'en-gb');
    this._tabularDashboardService.getDashboardSla(sdate, edate, this.emailInboxSLA, this.emailInboxCategorySLA).subscribe(result => {
      this.dataSLA = result;
      this.onPageChanged({pageIndex:this.pageIndex,pageSize:this.pageSize});
      this.isLoading = false;
      // console.log("data source ", result);
    },
    error => {
      console.error('Error:', error);
      this.isLoading = false;
    });

  }

  // Get process performance email processed
  public getProcessClearance() {
    this.isLoading = true;
    let categoryId = 0;
    let subCategoryId = 0;
    this.emailInboxProcess = this.emailInboxProcess === undefined ? 0 : this.emailInboxProcess;
    this.emailInboxCategoryProcess = this.emailInboxCategoryProcess === undefined ? 0 : this.emailInboxCategoryProcess;
    const date=new Date();
    const procesSDate=this.startDate?this.startDate:date.setMonth(date.getMonth()-1);
    const procesEDate=this.endDate?this.endDate:date;
    
    const sdate = formatDate(procesSDate, 'yyyy-MM-dd', 'en-gb');
    const edate = formatDate(procesEDate, 'yyyy-MM-dd', 'en-gb');
    this._tabularDashboardService.getProcessClearance(sdate, edate, this.emailInboxProcess, this.emailInboxCategoryProcess).subscribe(result => {
      this.dataProcess = result;
      this.onPageChanged({pageIndex:this.pageIndex,pageSize:this.pageSize});
      this.isLoading = false;
      // console.log("data source ", result);
    },
      error => {
        console.error('Error:', error);
        this.isLoading = false;
      });

  }
  ///////////////////////////////////////////////

  // Export to csv data for agent live performance

  exportCSV(): void {
    this.isLoading = true;
    const Option = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      title: 'Your title',
      useBom: true,
      noDownload: false,
      headers: ['Employee Name', 'TEUsername', 'Agent Status', 'LoggedIn Status', 'Productive', 'Non Productive', 'AHT', 'Total Attempt', 'ForwardedCount', 'QueryCount', 'QueryCompleted', 'NFACount', 'RequestFurtherInfoOther', 'Others', 'NFAJunkSPAMemail', 'FutureDate', 'QueryCompletedNFA', 'SupportEscalation']
    };
   
     new ngxCsv(this.dataSource, 'AgentlivePerformance', Option);
     this.isLoading = false;

  }


  // Export to csv data for sladashboard
  exportCSVSLA(): void {
    this.isLoading = true;
    const Option = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      title: 'Your title',
      useBom: true,
      noDownload: false,
      headers: ['Category', 'SLA']
    };
   
     new ngxCsv(this.dataSLA, 'SLADashboard', Option);
     this.isLoading = false;
  }

  // Export to csv data for agent performance 
  exportAgentCSV(): void {
    this.isLoading = true;
    const Option = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      title: 'Your title',
      useBom: true,
      noDownload: false,
      headers: ['EmpName', 'TEUsername', 'Category', 'AHT', 'TotalAttempt', 'ForwardedCount', 'QueryCount', 'QueryCompleted', 'NFACount', 'RequestFurtherInfoOther', 'Others', 'NFAJunkSPAMemail', 'FutureDate', 'QueryCompletedNFA', 'SupportEscalation']
    };
   
     new ngxCsv(this.dataAgent, 'AgentClearance', Option);
     this.isLoading = false;

  }

  // Export to csv data for process performance
  exportProcessCSV(): void {
    this.isLoading = true;
    const Option = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      title: 'Your title',
      useBom: true,
      noDownload: false,
      headers: ['Category', 'Received', 'Attempted', 'Unattempted', 'AHT', 'ForwardedCount', 'QueryCount', 'QueryCompleted', 'NFACount', 'RequestFurtherInfoOther', 'Others', 'NFAJunkSPAMemail', 'FutureDate', 'QueryCompletedNFA', 'SupportEscalation']
    };
   
     new ngxCsv(this.dataProcess, 'ProcessClearance', Option);
     this.isLoading = false;
  }


//////////////////////////////////////////

TopPerformer() {
  this.dataAgent.sort((a, b) => {
    const aValue = a.aht;
    const bValue = b.aht;

    return aValue - bValue;
  });

  // Update the data source to reflect the sorted data
 // this.dataAgent = new MatTableDataSource<IAgentPerformance>(this.dataAgent);
}

// Sort the Mat table data based on the AHT column in descending order
BottomPerformer() {
  this.dataAgent.sort((a, b) => {
    const aValue = a.aht;
    const bValue = b.aht;

    return bValue - aValue;
  });

  // Update the data source to reflect the sorted data
 // this.dataSource = new MatTableDataSource<IAgentPerformance>(this.dataAgent);
}

// Get agent clearance data from the API



}

///////////////////////////////////////////////////////////
//}
