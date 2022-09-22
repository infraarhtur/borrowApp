
   
import { AbstractControl } from '@angular/forms';

export function selectInicial(control: AbstractControl) {

  if (control.value === 0) {
     return { valid: true };
  }

  return null;
}