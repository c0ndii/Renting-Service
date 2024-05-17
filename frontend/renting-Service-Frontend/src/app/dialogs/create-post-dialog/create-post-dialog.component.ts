import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-post-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatInputModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatDividerModule, MatButtonToggleModule, CommonModule],
  templateUrl: './create-post-dialog.component.html',
  styleUrl: './create-post-dialog.component.scss'
})
export class CreatePostDialogComponent {
  constructor(private snackbarService: SnackbarService, private authService: AuthService, public dialog: MatDialogRef<CreatePostDialogComponent>, private router: Router ) {
  }
  title = new FormControl('', [
    Validators.required,
    Validators.maxLength(20),
  ]);
  description = new FormControl('', [
    Validators.required,
    Validators.maxLength(500),
  ]);
  mainCategory = new FormControl('', [
    Validators.required,
  ]);
  sleepingPlaceCount = new FormControl('', [
    Validators.required,
    Validators.min(1),
  ]);
  price = new FormControl('', [
    Validators.required,
    Validators.min(1),
  ]);
  features = new FormControl('', [
    Validators.required,
  ]);
  categories = new FormControl('', [
    Validators.required,
  ]);
  checkPostType() : boolean{
    console.log(this.selectedValue)
    if(this.selectedValue == "rent"){
      return true;
    }
    return false;
  }
  selectedValue: string = 'rent';
  errorMessage: string = '';
  status: string = '';
}
