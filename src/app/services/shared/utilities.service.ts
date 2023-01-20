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
}
