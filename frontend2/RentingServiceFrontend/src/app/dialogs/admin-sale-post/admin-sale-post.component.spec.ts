import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSalePostComponent } from './admin-sale-post.component';

describe('AdminSalePostComponent', () => {
  let component: AdminSalePostComponent;
  let fixture: ComponentFixture<AdminSalePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSalePostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSalePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
