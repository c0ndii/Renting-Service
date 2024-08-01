import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalePostComponent } from './edit-sale-post.component';

describe('EditSalePostComponent', () => {
  let component: EditSalePostComponent;
  let fixture: ComponentFixture<EditSalePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSalePostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSalePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
