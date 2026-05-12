import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.API_URL}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put<T>(path: string, body: any = {}): Observable<T> {
    return this.http.put<T>(`${this.API_URL}${path}`, body)
      .pipe(catchError(this.formatErrors));
  }

  post<T>(path: string, body: any = {}): Observable<T> {
    return this.http.post<T>(`${this.API_URL}${path}`, body)
      .pipe(catchError(this.formatErrors));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.API_URL}${path}`)
      .pipe(catchError(this.formatErrors));
  }

  private formatErrors(error: HttpErrorResponse) {
    // Standardize error format based on backend res_message/exception_handler
    const errorMessage = error.error?.message || 'An unexpected error occurred';
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      errors: error.error?.object || {}
    }));
  }
}
