import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {PageResponseDto} from "../GenericTypes/pageResponseDto";
import {GenericResponse} from "../GenericTypes/GenericResponse";
import {Router} from "@angular/router";
import {logout} from "./auth.service";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable({
  providedIn: 'root',
})
export class RequestService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private message: NzMessageService,
  ) {
  }


  get<T>(url: string, options: object = {}): Observable<GenericResponse<T>> {
    return this.http.get<GenericResponse<T>>(url, options).pipe(
      catchError( error => this.handleError(error, this.router))
    );
  }

  getPageable<T>(url: string, options: object = {}): Observable<GenericResponse<PageResponseDto<T>>> {

    return this.http.get<GenericResponse<PageResponseDto<T>>>(url, options).pipe(
      catchError( error => this.handleError(error, this.router))
    );
  }

  getList<T>(url: string, options: object = {}): Observable<GenericResponse<[T]>> {
    return this.http.get<GenericResponse<[T]>>(url, options).pipe(
      catchError( error => this.handleError(error, this.router))
    );
  }

  post<T>(url: string, body: any = null, options: object = {}): Observable<GenericResponse<T>> {
    return this.http.post<GenericResponse<T>>(url, body, options).pipe(
      catchError( error => this.handleError(error, this.router))
    );
  }

  put<T>(url: string, body: any, options: object = {}): Observable<GenericResponse<T>> {
    return this.http.put<GenericResponse<T>>(url, body, options).pipe(
      catchError( error => this.handleError(error, this.router))
    );
  }

  delete<T>(url: string, options: object = {}): Observable<GenericResponse<T>> {
    return this.http.delete<GenericResponse<T>>(url, options).pipe(
      catchError( error => this.handleError(error, this.router))
    );
  }


  private handleError(error: HttpErrorResponse, router: Router) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      if (error.status == 401) {
        logout()
        router.navigate(['/login'])
      }
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);

      this.message.create("error", error.error.content);
    }
    // return an observable with a user-facing error message
    return throwError(() => new Error('Something bad happened; please try again later.'))
  };

}
