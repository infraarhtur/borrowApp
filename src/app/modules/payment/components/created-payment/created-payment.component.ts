import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/shared/snackbar.service';

@Component({
  selector: 'app-created-payment',
  templateUrl: './created-payment.component.html',
  styleUrls: ['./created-payment.component.scss']
})
export class CreatedPaymentComponent implements OnInit {

  @Input() idContact:string;
  public frmAddPayment: FormGroup;

  constructor(
    private _formBuilder:     FormBuilder,
    public router:            Router,
    private _route:           ActivatedRoute,
  ) {

    this.validations();

  }

  ngOnInit(): void {
    console.log('soy app-created-payment ');
  }
  ngOnChanges(changes: SimpleChanges): void{

  }

  cancel(){

  }

  validations(){
    this.frmAddPayment = this._formBuilder.group({
      commentPayment:  [null, [Validators.maxLength(100)]],
      valuePayment:    [null, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]]
    })
  }

  addPayment(){
    if(this.frmAddPayment.invalid){ return;}
    const objPayment        = this.frmAddPayment.value;
    objPayment.idContact    = this.idContact;
    objPayment.typePayment  = 'General';

    console.log('objPayment',objPayment)

  }
}
