import {  IWorkmanagementModel } from './../models/work-management/workmanagement';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IResponseTemplate } from '../models/email/responsetemplate';
import { IEmailSignature } from '../models/email/emailsignature';
import { IUserProductivity } from '../models/email/userproductivity';
import { catchError } from 'rxjs/operators';
import { IAttachment } from 'src/app/models/email/attachments';
import { ISentViewMail } from '../models/email/sentview';
import { IEmailCategories } from '../models/email/emailcategories';
import { IComposeNewMail } from '../models/email/composenewmail';
import { API_BASE_URL } from 'src/config/config';
import { ErrorHandlerService } from './error-handler.service';
import { IWorkBySearch } from 'src/app/models/email/workbysearch';
@Injectable({
  providedIn: 'root',
})
export class EmailService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  //apiURL = 'https://localhost:7062/api';

  constructor(private httpClient: HttpClient,private errorHandler: ErrorHandlerService) { }
  getEmailCategoriesByUser(userEmail: string): Observable<IEmailCategories[]> {
    const url = `${API_BASE_URL}/WorkManagement/GetEmailCategoriesByUser?userEmail=${userEmail}`;
    return this.httpClient
      .get<IEmailCategories[]>(url)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
  
  loadAttachment(attachmentId: number): Observable<IAttachment> {
    return this.httpClient
      .get<IAttachment>(API_BASE_URL + '/WorkManagement/LoadAttachment?attachmentId=' + attachmentId)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
  loadComposeAttachment(attachmentId: number): Observable<IAttachment> {
    return this.httpClient
      .get<IAttachment>(API_BASE_URL + '/WorkManagement/LoadComposeAttachment?attachmentId=' + attachmentId);
  }
  getSentEmailList(userId: string,
    categoryId: number | null,
    subCategoryId: number | null,
    subject: string,
    sentDateRange: string,
    sendType: string): Observable<ISentViewMail> {
    const url = `${API_BASE_URL}/WorkManagement/GetSentEmailList`;

    // Encode sentDateRange parameter
    const [startDate, endDate] = sentDateRange.split('@');

    // Set up the request parameters
    let params = new HttpParams()
      .set('userId', userId)
      .set('categoryId', categoryId?.toString() || '')
      .set('subCategoryId', subCategoryId?.toString() || '')
      .set('subject', subject)
      .set('sentDateRange', sentDateRange)
      .set('sendType', sendType);

    return this.httpClient.get<ISentViewMail>(url, { params })
    .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  getResponseTemplate(categoryId: number): Observable<any> {
    return this.httpClient
      .get<any>(API_BASE_URL + '/WorkManagement/GetEmailResponseTemplates?categoryId=' + categoryId);
  }
  getEmailSignature(categoryId: number): Observable<any> {
    return this.httpClient
      .get<any>(API_BASE_URL + '/WorkManagement/GetEmailSignatureTemplate?categoryId=' + categoryId);
  }
  getUserProductivity(empId: string): Observable<any> {
    return this.httpClient
      .get<IUserProductivity>(API_BASE_URL + '/WorkManagement/GetUserProductivity?empId=' + empId);
  }
  // SearchUserGraph(keyword: string): Observable<any> {
  //   return this.httpClient
  //     .get<any>(this.apiURL + '/Email/SearchUserGraph?keyword=' + keyword);
  // }

  saveSendEmailHistory(emailData: any): Observable<any> {
    return this.httpClient
      .post<any>(API_BASE_URL + '/Email/Send', emailData)
      .pipe(catchError(this.handleError));
  }
  getAttachments(emailId: number, emailSentType: string): Observable<IAttachment[]> {
    const url = `${API_BASE_URL}/WorkManagement/getAttachmentToSentViewMail?emailId=${emailId}&emailSentType=${emailSentType}`;
    return this.httpClient.get<IAttachment[]>(url);
  }
  saveUploadedfiles(attachmentDetails: IAttachment[]) {
    return this.httpClient
      .post<any>(API_BASE_URL + '/WorkManagement/SaveUploadedFiles', attachmentDetails)
      .pipe(catchError(this.handleError));
  }
  saveUploadedComposefiles(attachmentDetails: IAttachment[]) {
    return this.httpClient
      .post<any>(API_BASE_URL + '/WorkManagement/SaveComposeAttachments', attachmentDetails)
      .pipe(catchError(this.handleError));
  }
  deleteAttachment(attachmentId: number): Observable<any> {
    return this.httpClient.delete<any>(API_BASE_URL + '/WorkManagement/DeleteAttachment?attachmentId=' + attachmentId)
    .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
  deleteComposeAttachment(attachmentId: number): Observable<any> {
    return this.httpClient.delete<any>(API_BASE_URL + '/WorkManagement/DeleteComposeAttachment?attachmentId=' + attachmentId)
    .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
  private handleError(error: any) {
    console.error('API error:', error);
    return throwError('An error occurred. Please try again later.');
  }
  saveComposeEmail(composeEmail: IComposeNewMail) {
    return this.httpClient.post<IComposeNewMail>(API_BASE_URL + '/Email/SendComposeEmail', composeEmail)
    .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
  getNextWork(UserEmail: string): Observable<IWorkmanagementModel> {
    return this.httpClient
      .get<IWorkmanagementModel>(API_BASE_URL + '/WorkManagement/GetEmailWork?userID=' + UserEmail)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
  saveWork(WorkmanagementModel:IWorkmanagementModel){
    return this.httpClient.post<IWorkmanagementModel>(API_BASE_URL + '/WorkManagement/SaveWork', WorkmanagementModel)
    .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
  getWorkBySearch(workId:number,empId:string,type:string){
    const url = `${API_BASE_URL}/WorkManagement/WorkManagement?WorkID=${workId}&EmpID=${empId}&type=${type}`;
    return this.httpClient.get<IWorkBySearch[]>(url);
    console.log(this.getWorkBySearch(workId,empId,type));
  }  
  
}
