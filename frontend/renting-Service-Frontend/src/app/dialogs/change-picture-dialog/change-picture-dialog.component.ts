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
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { backendUrlBase } from 'src/app/appsettings/constant';
import { NavbarService } from 'src/app/services/navbar.service';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { editUserPictureDto } from 'src/app/interfaces/editUserPictureDto';

@Component({
  selector: 'app-change-picture-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatInputModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatDividerModule],
  templateUrl: './change-picture-dialog.component.html',
  styleUrl: './change-picture-dialog.component.scss'
})
export class ChangePictureDialogComponent {
  constructor(private snackbarService: SnackbarService, private authService: AuthService, public dialog: MatDialogRef<ChangePictureDialogComponent>, private http: HttpClient, private navbar: NavbarService) {
    
  }
  picture = new FormControl('', [
    Validators.required,
  ]);
  errorMessage: string = '';
  status: string = '';
  data = new FormData();
  imageSrc: string | ArrayBuffer | null= '';
  handleFileInput(event: any){
    const files = event.files as File[];
    this.snackbarService.openSnackbar("Zdjęcie jest dodawane", "info");
    this.data.append('Picture',files[0]);
    this.snackbarService.dismissSnackbar();
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    reader.readAsDataURL(files[0]);
    this.snackbarService.openSnackbar("Zdjęcie zostało załadowane", "info");
  }
  sendFileInput(){
    if(!this.data.get('Picture')){
      this.snackbarService.openSnackbar("Nie wybrano zdjęcia", "Error");
      return;
    }
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    this.http.patch(backendUrlBase + 'user/editpicture/',this.data, {headers: headers}).subscribe((response) => {
      if(response === null){
        this.snackbarService.openSnackbar("Zdjęcie zostało dodane", "Success");
      }
      this.dialog.close();
    }, (error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          this.errorMessage = 'Nie można zmienić zdjęcia innego użytkownika';
          this.status = 'Error';
          break;
        default:
          this.errorMessage = 'Nie można połączyć się z serwerem';
          this.status = 'Error';
          break;
      }
      this.snackbarService.openSnackbar(this.errorMessage,this.status);
    });
  }
}
