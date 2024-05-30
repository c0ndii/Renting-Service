import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindPasswordDialogComponent } from './remind-password-dialog.component';

describe('RemindPasswordDialogComponent', () => {
  let component: RemindPasswordDialogComponent;
  let fixture: ComponentFixture<RemindPasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemindPasswordDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemindPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
