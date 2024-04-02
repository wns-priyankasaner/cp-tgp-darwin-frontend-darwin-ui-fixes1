import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOutstandingChart } from '../models/performance-dashboard/statusSplitModel';
import { IReceivedVsCompletedChart } from '../models/performance-dashboard/receivedVsCompleted';
import { ISLABreakDownChart } from '../models/performance-dashboard/slaBreakdownModel';
import { ISLALineGraph } from '../models/performance-dashboard/slalinegraph';
import { IHoursBarGraph } from '../models/performance-dashboard/hours-bar-graph';
import { IAHTLineGraph } from '../models/performance-dashboard/aht-line-graph';
import { API_BASE_URL } from 'src/config/config';
@Injectable({
  providedIn: 'root'
})
export class PerformanceDashboardService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };


  //apiURL = 'https://localhost:7062/api';
  constructor(private httpClient: HttpClient) { }

  getOutstaningGraph(year: number, month: number,filterType:string, categoryId: number, subCategoryId: number): Observable<IOutstandingChart> {
    const url = `${API_BASE_URL}/BusinessDashboard/GetOutstaning?year=${year}&month=${month}&filterType=${filterType}&CategoryID=${categoryId}&SubCategoryID=${subCategoryId}`;
    return this.httpClient.get<IOutstandingChart>(url);
  }

  getSLABreakdown(year: number, month: number,filterType:string, categoryId: number, subCategoryId: number): Observable<ISLABreakDownChart> {
    const url = `${API_BASE_URL}/BusinessDashboard/GetSLABreakdown?year=${year}&month=${month}&filterType=${filterType}&CategoryID=${categoryId}&SubCategoryID=${subCategoryId}`;
    return this.httpClient.get<ISLABreakDownChart>(url);
  }

  getReceivedVsCompletedData(year: number, month: number,filterType:string, categoryId: number, subCategoryId: number): Observable<IReceivedVsCompletedChart> {
    const url = `${API_BASE_URL}/BusinessDashboard/GetReceivedVsCompleted?year=${year}&month=${month}&filterType=${filterType}&CategoryID=${categoryId}&SubCategoryID=${subCategoryId}`;
    return this.httpClient.get<IReceivedVsCompletedChart>(url);
  }

  getHours(year: number, month: number,filterType:string, categoryId: number, subCategoryId: number): Observable<IHoursBarGraph> {
    const url = `${API_BASE_URL}/BusinessDashboard/GetHours?year=${year}&month=${month}&filterType=${filterType}&CategoryID=${categoryId}&SubCategoryID=${subCategoryId}`;
    return this.httpClient.get<IHoursBarGraph>(url);
  }

  getAHT(year: number, month: number,filterType:string, categoryId: number, subCategoryId: number): Observable<IAHTLineGraph> {
    const url = `${API_BASE_URL}/BusinessDashboard/GetAHT?year=${year}&month=${month}&filterType=${filterType}&CategoryID=${categoryId}&SubCategoryID=${subCategoryId}`;
    return this.httpClient.get<IAHTLineGraph>(url);
  }

  getSLAData(year: number, month: number,filterType:string, categoryId: number, subCategoryId: number): Observable<ISLALineGraph> {
    const url = `${API_BASE_URL}/BusinessDashboard/GetSLAData?year=${year}&month=${month}&filterType=${filterType}&CategoryID=${categoryId}&SubCategoryID=${subCategoryId}`;
    return this.httpClient.get<ISLALineGraph>(url);
  }
}
