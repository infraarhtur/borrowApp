import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dialog-dynamic-text',
  templateUrl: './dialog-dynamic-text.component.html',
  styleUrls: ['./dialog-dynamic-text.component.scss']
})
export class DialogDynamicTextComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogDynamicTextComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }


  ok(){
    this.dialogRef.close(true);
  }
  cancel(){

    this.dialogRef.close(false);
  }

}
