import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-created-payment',
  templateUrl: './created-payment.component.html',
  styleUrls: ['./created-payment.component.scss']
})
export class CreatedPaymentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('soy app-created-payment ');
  }

}
