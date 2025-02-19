import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdiComponent } from './ddi.component';

describe('DdiComponent', () => {
  let component: DdiComponent;
  let fixture: ComponentFixture<DdiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DdiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DdiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
