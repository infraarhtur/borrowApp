import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';

//#region services
//#endregion services

//#region bibliotecas
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { DialogErrorComponent } from '../shared/components/dialog-error/dialog-error.component';

//#endregion bibliotecas

@Injectable({
  providedIn: 'root',
})
export class MostrarOcultarSpinnerInterceptor implements HttpInterceptor {
  // tslint:disable: variable-name
  constructor(private spinner: MatDialog) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const ref = this.spinner.open(DialogErrorComponent, {
      panelClass: 'custom-modalbox'
    });
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Sent) {
          ref;
        }
        return event;
      }),
      finalize(() => {
        if (HttpEventType.Sent === 0) {
          ref.close();
        }
      })
    );
  }
}
