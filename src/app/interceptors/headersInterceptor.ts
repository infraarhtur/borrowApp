import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class HeadersInterceptor implements HttpInterceptor {
  token!: string;
  constructor(public router: Router) {
    // this.token = localStorage.getItem('token').toString();
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json; charset=UTF-8'
    );
    // 'X-TOKEN': this.token,
    const reqClone = req.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=UTF-8',
       
      },
    });



    return next.handle(reqClone).pipe(

  // tap((event: HttpEvent<any>) => {

        
  //     }),
      catchError(this.manejarErrores)


    );
  }

  // tslint:disable-next-line: typedef
  manejarErrores(error: HttpErrorResponse) {
console.log('entro al error')
    console.log('error servicio', error.message);
    return throwError('error personalizado', error.error);
  }
}



