import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullRequestAllComponent } from './pull-request-all.component';

describe('PullRequestAllComponent', () => {
  let component: PullRequestAllComponent;
  let fixture: ComponentFixture<PullRequestAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PullRequestAllComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PullRequestAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
