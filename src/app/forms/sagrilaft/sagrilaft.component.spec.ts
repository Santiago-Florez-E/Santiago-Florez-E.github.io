import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SagrilaftComponent } from './sagrilaft.component';

describe('SagrilaftComponent', () => {
  let component: SagrilaftComponent;
  let fixture: ComponentFixture<SagrilaftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SagrilaftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SagrilaftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
