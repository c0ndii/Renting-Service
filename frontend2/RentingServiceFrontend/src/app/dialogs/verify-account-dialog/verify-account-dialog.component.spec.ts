import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAccountDialogComponent } from './verify-account-dialog.component';

describe('VerifyAccountDialogComponent', () => {
  let component: VerifyAccountDialogComponent;
  let fixture: ComponentFixture<VerifyAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyAccountDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifyAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
