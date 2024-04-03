import { Component, Inject, OnInit} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, private snackbarService: SnackbarService) {}
  get Icon(){
    switch(this.data.snackType) {
      case 'Success':
        return 'done';
      case 'Error':
        return 'error';
      case 'Warn':
        return 'warning';
      default:
        return 'info';
    }
  }
  
  onClick(){
    this.snackbarService.dismissSnackbar();
  }

  ngOnInit() {}
}
