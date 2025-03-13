import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviwerComponent } from './interviwer.component';

describe('InterviwerComponent', () => {
  let component: InterviwerComponent;
  let fixture: ComponentFixture<InterviwerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviwerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviwerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
