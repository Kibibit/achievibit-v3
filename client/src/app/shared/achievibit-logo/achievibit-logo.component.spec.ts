import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievibitLogoComponent } from './achievibit-logo.component';

describe('AchievibitLogoComponent', () => {
  let component: AchievibitLogoComponent;
  let fixture: ComponentFixture<AchievibitLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievibitLogoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AchievibitLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
