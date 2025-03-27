import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullRequestProfileComponent } from './pull-request-profile.component';

describe('PullRequestProfileComponent', () => {
  let component: PullRequestProfileComponent;
  let fixture: ComponentFixture<PullRequestProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PullRequestProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PullRequestProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
