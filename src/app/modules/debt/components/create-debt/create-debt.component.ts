import { Component, OnInit, Output, EventEmitter, OnDestroy, Inject} from '@angular/core';
import { FormGroup,  Validators ,FormBuilder } from '@angular/forms';

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
   private formBuilder: FormBuilder
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

}
