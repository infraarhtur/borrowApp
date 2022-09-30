import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef,MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.scss']
})
export class CustomSnackbarComponent implements OnInit {


  constructor(
    public snackBarRef: MatSnackBarRef<CustomSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any){


    switch(data.type ) {
      case 'info': {

         data.icon = 'info',
         data.color = 'rgb(0, 174, 255)'
         break;
      }
      case 'error': {
        data.icon = 'report',
        data.color = 'red'
         break;
      }
      case 'warning': {
        data.icon = 'warning',
        data.color = 'yellow'
         break;
      }
      case 'ok': {
        data.icon = 'check_circle',
        data.color = 'green'
         break;
      }
      default: {
        data.icon = 'highlight_off'
        data.color = 'blue'
         break;
      }
   }

   }

  ngOnInit(): void {
  }

}
