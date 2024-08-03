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
import { SnackbarService } from '../../services/snackbar.service';
import { AuthService } from '../../services/auth.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { backendUrlBase } from '../../appsettings/constant';
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-change-picture-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatDividerModule,
  ],
  templateUrl: './change-picture-dialog.component.html',
  styleUrl: './change-picture-dialog.component.scss',
})
export class ChangePictureDialogComponent {
  constructor(
    private snackbarService: SnackbarService,
    protected authService: AuthService,
    public dialog: MatDialogRef<ChangePictureDialogComponent>,
    private http: HttpClient,
    private navbar: NavbarService
  ) {}
  picture = new FormControl('', [Validators.required]);
  errorMessage: string = '';
  status: string = '';
  data = new FormData();
  imageSrc: string = '';
  handleFileInput(event: any) {
    const reader = new FileReader();
    const image = event.files[0];
    reader.readAsDataURL(image);
    reader.onload = async () => {
      await this.resizeImage(reader.result as string).then((resolve: any) => {
        this.data.append('Picture', this.urlToFile(resolve));
        this.imageSrc = resolve;
      });
    };
  }
  sendFileInput() {
    if (!this.data.get('Picture')) {
      this.snackbarService.openSnackbar('Nie wybrano zdjęcia', 'Error');
      return;
    }
    const headers = new HttpHeaders().set(
      'Content-Type',
      'multipart/form-data'
    );
    this.http
      .patch(backendUrlBase + 'user/editpicture/', this.data, {
        headers: headers,
      })
      .subscribe(
        (response) => {
          if (response === null) {
            const img = this.imageSrc.replace('data:image/png;base64,', '');
            this.authService.changePicture(img);
            this.snackbarService.openSnackbar(
              'Zdjęcie zostało dodane',
              'Success'
            );
          }
          this.dialog.close();
        },
        (error: HttpErrorResponse) => {
          switch (error.status) {
            case 401:
              this.errorMessage =
                'Nie można zmienić zdjęcia innego użytkownika';
              this.status = 'Error';
              break;
            default:
              this.errorMessage = 'Nie można połączyć się z serwerem';
              this.status = 'Error';
              break;
          }
          this.snackbarService.openSnackbar(this.errorMessage, this.status);
        }
      );
  }
  resizeImage(imageURL: any): Promise<any> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(image, 0, 0, 200, 200);
        }
        var data = canvas.toDataURL('image/png', 1);
        resolve(data);
      };
      image.src = imageURL;
    });
  }
  urlToFile(url: string) {
    url = url.replace('data:image/png;base64,', '');
    const bytesArray = new Uint8Array(
      atob(url)
        .split('')
        .map((char) => char.charCodeAt(0))
    );
    const blob = new Blob([bytesArray], { type: 'image/png' });
    return blob;
  }
}
