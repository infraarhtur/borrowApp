import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { CustomSnackbarComponent } from 'src/app/shared/components/custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private _snackBar: MatSnackBar,
  ) { }


  customSnackbar( message:string ,
     type:string,
     duration:number= null,
     verticalPosition: MatSnackBarVerticalPosition='top',
     horizontalPosition: MatSnackBarHorizontalPosition = 'center'
     ){

    this._snackBar.openFromComponent(CustomSnackbarComponent, {
      duration,
      verticalPosition: verticalPosition,
      horizontalPosition: horizontalPosition,
      data:{

        message: message,
        type: type
    }})
  }
}
