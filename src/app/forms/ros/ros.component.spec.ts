import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosComponent } from './ros.component';

describe('RosComponent', () => {
  let component: RosComponent;
  let fixture: ComponentFixture<RosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
