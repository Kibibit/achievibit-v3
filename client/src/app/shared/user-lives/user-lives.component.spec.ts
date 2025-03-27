import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLivesComponent } from './user-lives.component';

describe('UserLivesComponent', () => {
  let component: UserLivesComponent;
  let fixture: ComponentFixture<UserLivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UserLivesComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserLivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
