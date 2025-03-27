import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAllComponent } from './users-all.component';

describe('UsersAllComponent', () => {
  let component: UsersAllComponent;
  let fixture: ComponentFixture<UsersAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UsersAllComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UsersAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
