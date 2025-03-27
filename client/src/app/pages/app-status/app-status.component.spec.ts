import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStatusComponent } from './app-status.component';

describe('AppStatusComponent', () => {
  let component: AppStatusComponent;
  let fixture: ComponentFixture<AppStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AppStatusComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
