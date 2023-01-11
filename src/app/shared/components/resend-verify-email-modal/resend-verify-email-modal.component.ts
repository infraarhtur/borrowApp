import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/shared/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-resend-verify-email-modal',
  templateUrl: './resend-verify-email-modal.component.html',
  styleUrls: ['./resend-verify-email-modal.component.scss']
})
export class ResendVerifyEmailModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ResendVerifyEmailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }
  closeModal() {
    this.dialogRef.close(false);
  }

  sendVerificationEmail() {
    this.authService.sendEmailVerificationWithUser(this.data);
    this.dialogRef.close(false);
  }


}
