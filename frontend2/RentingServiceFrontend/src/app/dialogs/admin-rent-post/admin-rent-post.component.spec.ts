import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRentPostComponent } from './admin-rent-post.component';

describe('AdminRentPostComponent', () => {
  let component: AdminRentPostComponent;
  let fixture: ComponentFixture<AdminRentPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRentPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminRentPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
