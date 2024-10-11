import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardInputComponent } from './keyboard-input.component';

describe('KeyboardInputComponent', () => {
  let component: KeyboardInputComponent;
  let fixture: ComponentFixture<KeyboardInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KeyboardInputComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(KeyboardInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
