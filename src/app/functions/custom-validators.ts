
import { AbstractControl, FormGroup, ValidatorFn, Validator, NG_VALIDATORS, Validators , ValidationErrors} from '@angular/forms';
import { Directive, Input, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';

export class CustomValidators {

    static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
          if (!control.value) {
            // if control is empty return no error
            return null;
          }

          // test the value of the control against the regexp supplied
          const valid = regex.test(control.value);

          // if true, return no error (no error), else return error passed in the second parameter
          return valid ? null : error;
        };
      }

      static match(controlName: string, checkControlName: string): ValidatorFn {
        return (controls: AbstractControl) => {
          const control = controls.get(controlName);
          const checkControl = controls.get(checkControlName);

          if (checkControl?.errors && !checkControl.errors['matching']) {
            return null;
          }

          if (control?.value !== checkControl?.value) {
            controls.get(checkControlName)?.setErrors({ matching: true });
            return { matching: true };
          } else {
            return null;
          }
        };
      }

}
