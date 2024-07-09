import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalepostComponent } from './salepost.component';

describe('SalepostComponent', () => {
  let component: SalepostComponent;
  let fixture: ComponentFixture<SalepostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalepostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
