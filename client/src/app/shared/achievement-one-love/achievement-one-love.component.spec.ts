import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementOneLoveComponent } from './achievement-one-love.component';

describe('AchievementOneLoveComponent', () => {
  let component: AchievementOneLoveComponent;
  let fixture: ComponentFixture<AchievementOneLoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementOneLoveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AchievementOneLoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
