import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeyesComponent } from './leyes.component';

describe('LeyesComponent', () => {
  let component: LeyesComponent;
  let fixture: ComponentFixture<LeyesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeyesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeyesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
