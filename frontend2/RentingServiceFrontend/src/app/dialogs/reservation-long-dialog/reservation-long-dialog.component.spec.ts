import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationLongDialogComponent } from './reservation-long-dialog.component';

describe('ReservationLongDialogComponent', () => {
  let component: ReservationLongDialogComponent;
  let fixture: ComponentFixture<ReservationLongDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationLongDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationLongDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
