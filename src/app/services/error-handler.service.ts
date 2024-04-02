import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }
  handleError(error: any): Observable<never> {
    // Implement error handling logic here
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
}
