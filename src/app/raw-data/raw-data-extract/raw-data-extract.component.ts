import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { RawDataService } from 'src/app/services/raw-data.service';
import { CommonService } from 'src/app/services/common.service';
import { ICategory } from 'src/app/models/common/category';
import { ISubCategory } from 'src/app/models/common/subcategory';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-raw-data-extract',
  templateUrl: './raw-data-extract.component.html',
  styleUrls: ['./raw-data-extract.component.scss']

})
export class RawDataExtractComponent {
  startDate: any;
  endDate: any;
  startDatePoc: any;
  endDatePoc: any;
  emailInbox: any;
  emailInboxCategory: any;
  categories: ICategory[];
  subcategories: ISubCategory[];
  isLoading:boolean=false;

  loading=false;
  loadings=false;
  currentUserId: string;

  constructor(private _rawDataService: RawDataService, private _commonService: CommonService,
    private _userService:UserService) {

  }
  ngOnInit() {
    // this.emailInbox = 'Test';
    this.getCategories();
    this.emailInbox=this.emailInbox===undefined?0:this.emailInbox;
    this.getSubCategories(this.emailInbox);

    this._userService.currentUser$.subscribe(s=>{
      this.currentUserId = s;
   })

   const currentDate =new Date();
    this.startDate= new Date(currentDate.getFullYear(),currentDate.getMonth(),1);
   this.endDate=currentDate;

  }

  // Get todayDueData record
  public todayDueData() {
    
    this.isLoading = true;
    
    this._rawDataService.todayDueData(this.currentUserId , 0, 0)
      .subscribe(result => {
        alert("call");
        var rawData = result['rawData'];
        var file = new Blob([rawData], {
          type: 'application/csv'
        });
        var fileURL = URL.createObjectURL(file);
        var a = document.createElement('a');
        a.href = fileURL;
        a.target = '_blank';
        a.download = 'TodaysSLADueData.csv';
        document.body.appendChild(a);
        a.click();
        this.isLoading = false;
      }, error => {
        console.error('Error:', error);
        this.isLoading = false;
      });
  }
  


  // Get outstanding record
  public outStandingData() {
    this.isLoading=true;
    this._rawDataService.outStandingData(this.currentUserId , 0, 0).subscribe(result => {
      //console.log(result);
      //alert('call')
      //this.downloadFile(result);
      var rawData = result['rawData']
      var file = new Blob([rawData], {
        type: 'application/csv'
      });
      var fileURL = URL.createObjectURL(file);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = 'Outstanding Data.csv';
      document.body.appendChild(a);
      a.click();
      this.isLoading=false;
    }, error => {
      console.error('Error:', error);
      this.isLoading = false;
    });
  }



  // downloadOutstandingFile(data: any[]) {
  //   const replacer = (key: string, value: any) => (value === null ? '' : value); // specify how you want to handle null values here
  //   const header = Object.keys(data[0]);
  //   const csv = data.map((row) =>
  //     header
  //       .map((fieldName) => JSON.stringify(row[fieldName], replacer))
  //       .join(',')
  //   );
  //   csv.unshift(header.join(','));
  //   const csvArray = csv.join('\r\n');

  //   const a = document.createElement('a');
  //   const blob = new Blob([csvArray], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);

  //   a.href = url;
  //   a.download = 'OutstandingData.csv';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  //   a.remove();

  // }


// Get midata record
  public miData() {
    this.isLoading=true;
    let sdate = formatDate(this.startDate, 'yyyy-MM-dd', 'en-gb')
    let edate = formatDate(this.endDate, 'yyyy-MM-dd', 'en-gb')
    this.emailInbox=this.emailInbox===undefined?0:this.emailInbox;
    this.emailInboxCategory=this.emailInboxCategory===undefined?0:this.emailInboxCategory;
    this._rawDataService.miData(this.currentUserId, sdate, edate, this.emailInbox, this.emailInboxCategory,).subscribe(result => {
      //console.log(result);
      //this.downloadFile(result);

      var rawData = result['rawData']
      var file = new Blob([rawData], {
        type: 'application/csv'
      });
      var fileURL = URL.createObjectURL(file);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = 'MIData.csv';
      document.body.appendChild(a);
      a.click();
      this.isLoading=false;
    }, error => {
      console.error('Error:', error);
      this.isLoading = false;
    });
  }

  // Get completed record
  public completedData() {
    this.isLoading=true;
    let sdate = formatDate(this.startDate, 'yyyy-MM-dd', 'en-gb')
    let edate = formatDate(this.endDate, 'yyyy-MM-dd', 'en-gb')
    this.emailInbox=this.emailInbox===undefined?0:this.emailInbox;
    this.emailInboxCategory=this.emailInboxCategory===undefined?0:this.emailInboxCategory;
    this._rawDataService.completedData(this.currentUserId , sdate, edate, this.emailInbox, this.emailInboxCategory,).subscribe(result => {
      //console.log(result);
      //this.downloadFile(result);
      var rawData = result['rawData']
      var file = new Blob([rawData], {
        type: 'application/csv'
      });
      var fileURL = URL.createObjectURL(file);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = 'CompletedHandoffData.csv';
      document.body.appendChild(a);
      a.click();
      this.isLoading=false;
    }, error => {
      console.error('Error:', error);
      this.isLoading = false;
    });
  }

  // Get transactional record
  public transactionalData() {
    this.isLoading=true;
    let sdate = formatDate(this.startDate, 'yyyy-MM-dd', 'en-gb')
    let edate = formatDate(this.endDate, 'yyyy-MM-dd', 'en-gb')
    this.emailInbox=this.emailInbox===undefined?0:this.emailInbox;
    this.emailInboxCategory=this.emailInboxCategory===undefined?0:this.emailInboxCategory;
    this._rawDataService.transactionalData(this.currentUserId , sdate, edate, this.emailInbox, this.emailInbox,).subscribe(result => {
      //console.log(result);
      //this.downloadFile(result);
      var rawData = result['rawData']
      var file = new Blob([rawData], {
        type: 'application/csv'
      });
      var fileURL = URL.createObjectURL(file);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = 'TransactionalData.csv';
      document.body.appendChild(a);
      a.click();
      this.isLoading=false;
    }, error => {
      console.error('Error:', error);
      this.isLoading = false;
    });
  }


  // Get agentprocess record
  public agentProcessClearanceData() {
    this.isLoading=true;
    let sdate = formatDate(this.startDate, 'yyyy-MM-dd', 'en-gb')
    let edate = formatDate(this.endDate, 'yyyy-MM-dd', 'en-gb')
    this.emailInbox=this.emailInbox===undefined?0:this.emailInbox;
    this.emailInboxCategory=this.emailInboxCategory===undefined?0:this.emailInboxCategory;
    this._rawDataService.agentProcessClearanceData(this.currentUserId , sdate, edate, this.emailInbox, this.emailInboxCategory,).subscribe(result => {
      //console.log(result);
      //this.downloadFile(result);
      var rawData = result['rawData']
      var file = new Blob([rawData], {
        type: 'application/csv'
      });
      var fileURL = URL.createObjectURL(file);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = 'AgentProcessClearanceData.csv';
      document.body.appendChild(a);
      a.click();
      this.isLoading=false;
    }, error => {
      console.error('Error:', error);
      this.isLoading = false;
    });
  }

  // Get outstanding POC record
  public outstandingDataPOC() {
    this.isLoading=true;
    this._rawDataService.outstandingDataPOC(this.currentUserId , 0, 0).subscribe(result => {
      //console.log(result);
      //alert('call')
      //this.downloadFile(result);
      var rawData = result['rawData']
      var file = new Blob([rawData], {
        type: 'application/csv'
      });
      var fileURL = URL.createObjectURL(file);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = 'OutstandingDataPOC.csv';
      document.body.appendChild(a);
      a.click();
      this.isLoading=false;
    }, error => {
      console.error('Error:', error);
      this.isLoading = false;
    });
  }


  //Get midata POC record
  public miDataPOC() {
    this.isLoading=true;
    let sdate = formatDate(this.startDatePoc, 'yyyy-MM-dd', 'en-gb')
    let edate = formatDate(this.endDatePoc, 'yyyy-MM-dd', 'en-gb')

    this._rawDataService.miDataPOC(this.currentUserId, sdate, edate, 0, 0,).subscribe(result => {
      //console.log(result);
      //this.downloadFile(result);
      var rawData = result['rawData']
      var file = new Blob([rawData], {
        type: 'application/csv'
      });
      var fileURL = URL.createObjectURL(file);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = 'MIDataPOC.csv';
      document.body.appendChild(a);
      a.click();
      this.isLoading=false;
    }, error => {
      console.error('Error:', error);
      this.isLoading = false;
    });
  }

  // Load category
  getCategories() {
    this._commonService.getCategories().subscribe(result => {
      //console.log(result);
      this.categories = result;
    })
  }

  // Load subcategory
  getSubCategories(categoryId: number) {
    this._commonService.getSubCategories(categoryId).subscribe(result => {
      //console.log(result);
      this.subcategories = result;
    })
  }

  // Change email inbox 
  emailInboxChange(categoryId: any) {
    //alert(` ${this.emailInbox}`);

    this._commonService.getSubCategories(categoryId).subscribe(result => {
      this.subcategories = result;
    });



    //console.log(categoryId)


  }


}
