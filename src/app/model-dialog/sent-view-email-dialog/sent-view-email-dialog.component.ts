import { Component, ViewEncapsulation, Renderer2, OnInit } from '@angular/core';
import { ISentViewMail } from 'src/app/models/email/sentview';
import { formatDate } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { EmailService } from 'src/app/services/email.service';
import { CommonService } from 'src/app/services/common.service';
import { SendEmailComponent } from 'src/app/model-dialog/send-email-dialog/send-email-dialog.component'
import { MatDialog } from '@angular/material/dialog';
import { EmailbodyDialogSentviewComponent } from '../emailbody-dialog-sentview/emailbody-dialog-sentview.component';
import { ISubCategory } from 'src/app/models/common/subcategory';
import { ICategory } from 'src/app/models/common/category';

import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import { UserService } from 'src/app/services/user.service';
const ELEMENT_DATA: ISentViewMail[] = [

];
 export interface IEmailSendTypes {
  value: string;
  label: string;
}
@Component({
  selector: 'app-sent-view-email-dialog',
  templateUrl: './sent-view-email-dialog.component.html',
  styleUrls: ['./sent-view-email-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SentViewEmailDialogComponent implements OnInit {
  apiResponse: any;
  //displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumns: string[] = ['subjectLine', 'emailInbox', 'inboxCategory', 'to', 'cc', 'emailSentType', 'sentDate', 'sentBy', 'action'];
  dataSource: ISentViewMail[] = [];
  noRecordFound: boolean = false;
  activePageDataChunk: ISentViewMail[];
  startDate: any;
  endDate: any;
  emailInbox: any = 0;
  inboxCategory: any;
  subjectLine: any;
  to: any;
  cc: any;
  emailSentType: any;
  sentDate: any;
  sentBy: any;
  isSearchEnabled: boolean = false;
  isViewMode: boolean = false;
  categories: ICategory[];
  subcategories: ISubCategory[];
  emailInboxCategory: any = 0;
  userId: string;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  selectedValue:string;
  
  //categoryId:0;
  //subCategoryId:0;;
  subject: any;
  //sentDateRange:'2022-09-02#2022-09-14';
  ELEMENT_DATA: any[];
  isLoading: boolean = false;
  currentUserId: string;
  

  emailSendTypes: IEmailSendTypes[] = [
    { value: "110", label: "All" },
    { value: "111", label: "Reply" },
    { value: "112", label: "ReplyAll" },
    { value: "113", label: "Forward" },
    { value: "114", label: "Compose" },
  ];
  
  constructor(public dialog: MatDialog, private renderer: Renderer2, 
    public dialogRef: MatDialogRef<SentViewEmailDialogComponent>, private _emailservice: EmailService, 
    private _commonservice: CommonService, private _userService:UserService) { }
  ngOnInit() {
    
    this.getCategories();
    this.getSubCategories(this.emailInbox);



    this._userService.currentUser$.subscribe(s=>{
      this.currentUserId = s;
      this.getSentEmailList();
   })

  }

  getCategories() {
    this._commonservice.getCategories().subscribe(result => {
      // console.log(result);
      this.categories = result;
    })
  }
  getSubCategories(categoryId: number) {
    categoryId = categoryId == undefined ? 0 : categoryId;
    this._commonservice.getSubCategories(categoryId).subscribe(result => {

      //  console.log(result);
      this.subcategories = result;

    })
  }
  emailInboxChange(categoryId: any) {
    this.emailInboxCategory = 0;


    this._commonservice.getSubCategories(categoryId).subscribe(result => {
      this.subcategories = result;
    });

  }
  emailInboxCategoryChange() {

  }
  onPageChanged(e: any) {
    if (this.dataSource) {
      const firstCut = e.pageIndex * e.pageSize;
      const secondCut = firstCut + e.pageSize;
      //this.dataSource = this.dataSource.slice(firstCut, secondCut);
      this.activePageDataChunk = this.dataSource.slice(firstCut, secondCut);
      
    }
  }

  exportCsv(): void {
    this.isLoading = true;

    const table = document.getElementById('data-table');


    if (!table) {
      return;
    }


    let csv = '';


    const headerRow = table.getElementsByTagName('th');
    const headerData = Array.from(headerRow)
      .map((header) => header.textContent?.trim())
      .filter((header) => header !== 'Action');


    csv += headerData.join(',') + '\n';


    const rows = table.getElementsByTagName('tr');


    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowData = [];


      const cells = row.querySelectorAll('td:not(:last-child)');
      for (let j = 0; j < cells.length; j++) {
        const cell = cells[j];
        let cellData = cell.textContent?.trim();


        if (headerData[j] === 'SentDate' && cellData) {

          cellData = cellData.replace(/,/g, '');


          rowData.push(cellData);
        } else {

          rowData.push(cellData);
        }
      }


      const csvRow = rowData.join(',');


      csv += csvRow + '\n';
    }


    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });


    const link = this.renderer.createElement('a');
    this.renderer.setAttribute(link, 'href', URL.createObjectURL(blob));
    this.renderer.setAttribute(link, 'download', 'SentEmailReport.csv');
    this.renderer.setStyle(link, 'display', 'none');


    this.renderer.appendChild(document.body, link);


    this.renderer.selectRootElement(link).click();


    this.renderer.removeChild(document.body, link);
    this.isLoading = false;
  }


  getSentEmailList() {
    this.isLoading = true;
    const userId = this.currentUserId;
    
    let categoryId = this.emailInbox === 0 ? 0 : this.emailInbox;
    let subCategoryId = this.emailInboxCategory === 0 ? 0 : this.emailInboxCategory;
    let subject = this.subject || '' || null;
    let sentDateRange = null;
    const sendType = this.emailSentType || '' || null;
  
    if (this.startDate && this.endDate) {
      sentDateRange = `${this.formatDate(this.startDate)}@${this.formatDate(this.endDate)}`;
    } else if (this.startDate) {
      sentDateRange = `${this.formatDate(this.startDate)}@12/31/9999 11:59:59 PM`;
    } else if (this.endDate) {
      sentDateRange = `1/1/1753 12:00:00 AM@${this.formatDate(this.endDate)}`;
    } else {
      sentDateRange = '1/1/1753 12:00:00 AM@12/31/9999 11:59:59 PM';
    }
  
    this._emailservice.getSentEmailList(userId, categoryId, subCategoryId, subject, sentDateRange, sendType)
      .subscribe(
        (emails: ISentViewMail[] | ISentViewMail) => {
          if (Array.isArray(emails)) {
            this.dataSource = emails;
          } else {
            this.dataSource = [emails];
          }
          this.noRecordFound = this.dataSource.length === 0;
          this.onPageChanged({ pageIndex: this.pageIndex, pageSize: this.pageSize });
          this.isLoading = false;
          // ...
        },
        (error: any) => {
          console.error('Failed to fetch sent emails:', error);
          this.isLoading = false;
        }
      );
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year} ${date.toLocaleTimeString()}`;
  }


  closeModal() {

    this.dialogRef.close();
  }

  search() {
    this.getSentEmailList();

  }
  updateSearchButtonState(): void {
    if ((this.startDate && this.endDate && this.emailInbox) || this.subject) {
      this.isSearchEnabled = true;
    } else if (this.emailSentType && this.emailInbox) {
      this.isSearchEnabled = true;
    }
    else {
      this.isSearchEnabled = false;
    }
  }


  sendEmail(element: any) {
    const dialogRef = this.dialog.open(EmailbodyDialogSentviewComponent, {
      width: '100%',
      height: '100%',
      disableClose: true,
      data: { selectedAction: 'Email Body' }
    });
  }
  viewDetails(element: any) {
    const dialogRef = this.dialog.open(EmailbodyDialogSentviewComponent, {
      width: '100%',
      height: '100%',
      disableClose: true,
      data: { selectedAction: 'View Email Body' }
    });

  }
  clear() {
    this.startDate = null;
    this.endDate = null;
    this.emailInbox = null;
    this.emailInboxCategory = null;
    this.subject = null;
    this.updateSearchButtonState();
  
    // Fetch default data and update data source
    
  }

}
