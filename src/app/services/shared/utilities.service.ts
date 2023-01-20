import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  getTodayFormat(){
    const today = new Date();
    return today.getFullYear()
                      + '/' + (today.getMonth() + 1)
                      + '/' + today.getDate() + ' '
                      + today.getHours() + ':'+ today.getMinutes()
                      + ':'+ today.getSeconds();
  }

  convertStringToDate(dateString:string){
    const [dateValues, timeValues] = dateString.split(' ');
    const [year,month, day] = dateValues.split('/');
    const [hours, minutes, seconds] = timeValues.split(':');
    return  new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
  }
}
