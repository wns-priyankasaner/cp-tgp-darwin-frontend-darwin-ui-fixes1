
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICategory } from '../models/common/category';
import { IBreak } from '../models/common/break';
import {IActions} from '../models/common/actions';
import { IAuxQueuesBreak } from '../models/common/auxqueu';
import { ISubCategory } from '../models/common/subcategory';
import { IEmployee } from '../models/common/employee';
import { API_BASE_URL } from 'src/config/config';
import { DEBUG_LOGGING } from 'src/config/config';
import { ErrorHandlerService } from './error-handler.service';
@Injectable({
    providedIn: 'root',
})
export class CommonService {
    data:any;
    public getData(): any {
        return this.data;
      }
    
      public setData(data: any): void {
        this.data = data;
      }
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };

    //apiURL = 'https://localhost:7062/api';

    // Constuctor calling
    constructor(private http: HttpClient,private errorHandler: ErrorHandlerService) { }

    // API call to get categories
    getCategories(): Observable<ICategory[]> {
        return this.http
            .get<ICategory[]>(API_BASE_URL + '/CommonData/GetCategories')
            .pipe(
                catchError((error) => {
                  return this.errorHandler.handleError(error);
                })
            );
    }

    getSubCategories(categoryId:number): Observable<ISubCategory[]> {
        return this.http
            .get<ISubCategory[]>(API_BASE_URL + '/CommonData/GetSubCategories?categoryId=' + categoryId )
            .pipe(
                catchError((error) => {
                  return this.errorHandler.handleError(error);
                })
            );
    }

    getSubCategoriesByCategories(categoryIds:number[]): Observable<ISubCategory[]> {
        return this.http
            .get<ISubCategory[]>(API_BASE_URL + '/CommonData/GetSubCategoriesByCategoryIds?categoryIds=' + categoryIds )
            .pipe(
                catchError((error) => {
                  return this.errorHandler.handleError(error);
                })
            );
    }

    getEmployee(): Observable<IEmployee[]> {
        return this.http
            .get<IEmployee[]>(API_BASE_URL + '/CommonData/GetEmployees')
            .pipe(
                catchError((error) => {
                  return this.errorHandler.handleError(error);
                })
            );

    }
    getBreak(code:string): Observable<any> {
        return this.http
        .get<any>(API_BASE_URL + '/CommonData/GetAuxQueues?code='+code)
        .pipe(
            catchError((error) => {
              return this.errorHandler.handleError(error);
            })
        );

    }

    getActions(): Observable<any> {
        return this.http
        .get<any>(API_BASE_URL + '/CommonData/GetActions')
        .pipe(
            catchError((error) => {
              return this.errorHandler.handleError(error);
            })
        );

    }

    getContactType(): Observable<any> {
        return this.http
        .get<any>(API_BASE_URL + '/CommonData/getContactType')
        .pipe(
            catchError((error) => {
              return this.errorHandler.handleError(error);
            })
        );

    }
    
    addAuxThread(auxModel: IAuxQueuesBreak): Observable<any> {
        return this.http.post<any>(API_BASE_URL +'/CommonData/AddAuxThread', auxModel)
        .pipe(
            catchError((error) => {
              return this.errorHandler.handleError(error);
            })
        );
    }
    updateAuxThread(auxModel: IAuxQueuesBreak): Observable<any> {
        return this.http.post<any>(API_BASE_URL +'/CommonData/UpdateAuxThread', auxModel)
        .pipe(
            catchError((error) => {
              return this.errorHandler.handleError(error);
            })
        );
    }
    
    

}