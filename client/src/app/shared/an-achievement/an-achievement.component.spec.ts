import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnAchievementComponent } from './an-achievement.component';

describe('AnAchievementComponent', () => {
  let component: AnAchievementComponent;
  let fixture: ComponentFixture<AnAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnAchievementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
