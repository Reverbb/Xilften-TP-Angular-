import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroLoader } from './intro-loader';

describe('IntroLoader', () => {
  let component: IntroLoader;
  let fixture: ComponentFixture<IntroLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroLoader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
