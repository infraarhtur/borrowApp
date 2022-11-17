import { Component, OnInit, Output, EventEmitter, OnDestroy, Inject} from '@angular/core';
import { FormGroup,  Validators ,FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DebtService } from 'src/app/services/business/debt.service';
import { UserService } from 'src/app/services/shared/user.service';

@Component({
  selector: 'app-create-debt',
  templateUrl: './create-debt.component.html',
  styleUrls: ['./create-debt.component.scss']
})
export class CreateDebtComponent implements OnInit {
  public frmCreateDebt: FormGroup;
  contactList = [
    {value: 'Contacto1', viewValue: 'Contacto 1'},
    {value: 'Contacto2', viewValue: 'Contacto 2'},
    {value: 'Contacto3', viewValue: 'Contacto 3'},
    {value: 'Contacto4', viewValue: 'Contacto 4'}
  ];

  typeDebtList =[
    {value: '1', viewValue: 'Sin intereses'},
    {value: '2', viewValue: 'Interes fijo'},
    {value: '3', viewValue: 'Interes fijo por ciclo'},
    {value: '4', viewValue: 'Interes compuesto'},
    {value: '5', viewValue: 'Arriendo'},
    {value: '6', viewValue: 'Clase'}
  ]

  constructor(
   private formBuilder: FormBuilder,
   private datePipe: DatePipe,
   private debtService: DebtService,
   private userService:UserService
  ) {
    this.validations();
   }

  ngOnInit(): void {
  }

  validations(){

    this.frmCreateDebt = this.formBuilder.group({
      isGroupDebt:false,
      debtValue:  [null, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      contacts:   [null, [Validators.required]],
      concept:    [null, [Validators.required]],
      typeDebt:   [null, [Validators.required]],
      isFixedFees:[false],
      payDate:    [null, [Validators.required]]
    })
  }

  createDebit(){

  if(this.frmCreateDebt.invalid){ return;}
    const objDebt = this.frmCreateDebt.value;

    const payDate = objDebt.payDate.getFullYear()+'/'+(objDebt.payDate.getMonth()+1)+'/'+objDebt.payDate.getDate();

    objDebt.payDate = payDate;
    console.log('objeto del validador',this.frmCreateDebt.value, objDebt)
    const user = this.userService.getUserLocal();

    const resp = this.debtService.addDebt(user.uid,objDebt);
    debugger;
    alert(resp)

  }

  test(){

   const user = this.userService.getUserLocal();
  //  this.debtService.addDebt(user.)
  }

}

