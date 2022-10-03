import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpStepTwoComponent } from './components/sign-up-step-two/sign-up-step-two.component';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';



@NgModule({
  declarations: [
    SignUpStepTwoComponent
  ],
  imports: [

    CommonModule,
    UserRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,

  ],schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule { }
