import { Injectable } from '@angular/core';
import { IContactTypes } from '../models/insights-dashboard/contact-type';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CommonService } from './common.service';
import { ITopCustomer } from '../models/insights-dashboard/top-customers';
import { ITopCustomerDrilldown } from '../models/insights-dashboard/top-customers';
import { IEmailreceived } from '../models/insights-dashboard/emailreceived';
import { IAverageDays } from '../models/insights-dashboard/averagedays';
import { IEmailSentiments } from '../models/insights-dashboard/emailsentiments';
import { API_BASE_URL } from 'src/config/config';
@Injectable({
  providedIn: 'root'
})
export class InsightDashboardService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  //apiURL = 'https://localhost:7062/api';

  constructor(private httpClient: HttpClient) { }
 
  getContactTypeData(year: number, month: number, categoryId: number, subCategoryId: number): Observable<IContactTypes[]> {
    const url = `${API_BASE_URL}/InsightsDashboard/GetContactTypes?year=${year}&month=${month}&categoryId=${categoryId}&subCategoryId=${subCategoryId}`;
    return this.httpClient.get<IContactTypes[]>(url);
  }
  getTopCustomerData(year: number, month: number, categoryId: number, subCategoryId: number): Observable<{ topCustomers: ITopCustomer[], topCustomersDrillDown: ITopCustomerDrilldown[] }> {
    const url = `${API_BASE_URL}/InsightsDashboard/GetTopCustomer?year=${year}&month=${month}&categoryID=${categoryId}&subCategoryID=${subCategoryId}`;
    return this.httpClient.get<{ topCustomers: ITopCustomer[], topCustomersDrillDown: ITopCustomerDrilldown[] }>(url);
  }
  getEmailReceivedInboxData(year: number, month: number, categoryId: number, subCategoryId: number): Observable<IEmailreceived[]> {
    const url = `${API_BASE_URL}/InsightsDashboard/GetEmailReceivedInboxCategory?year=${year}&month=${month}&categoryId=${categoryId}&subCategoryId=${subCategoryId}`;
    return this.httpClient.get<IEmailreceived[]>(url);
  }

  getAverageDaysData(year: number, month: number, categoryId: number, subCategoryId: number): Observable<IAverageDays[]> {
    const url = `${API_BASE_URL}/InsightsDashboard/GetAverageDays?year=${year}&month=${month}&categoryId=${categoryId}&subCategoryId=${subCategoryId}`;
    return this.httpClient.get<IAverageDays[]>(url);
  }
  getEmailInboxSentimentsData(year: number, month: number, categoryId: number, subCategoryId: number): Observable<IEmailSentiments[]> {
    const url = `${API_BASE_URL}/InsightsDashboard/GetEmailInboxSentiments?year=${year}&month=${month}&categoryId=${categoryId}&subCategoryId=${subCategoryId}`;
    return this.httpClient.get<IEmailSentiments[]>(url);
  }
}
