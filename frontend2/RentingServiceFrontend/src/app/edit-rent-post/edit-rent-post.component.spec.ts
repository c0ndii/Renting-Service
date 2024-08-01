import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRentPostComponent } from './edit-rent-post.component';

describe('EditRentPostComponent', () => {
  let component: EditRentPostComponent;
  let fixture: ComponentFixture<EditRentPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRentPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditRentPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
