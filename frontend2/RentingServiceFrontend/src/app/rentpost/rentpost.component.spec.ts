import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentpostComponent } from './rentpost.component';

describe('RentpostComponent', () => {
  let component: RentpostComponent;
  let fixture: ComponentFixture<RentpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentpostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RentpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
