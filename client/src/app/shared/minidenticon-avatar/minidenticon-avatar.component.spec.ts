import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinidenticonAvatarComponent } from './minidenticon-avatar.component';

describe('MinidenticonAvatarComponent', () => {
  let component: MinidenticonAvatarComponent;
  let fixture: ComponentFixture<MinidenticonAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinidenticonAvatarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinidenticonAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
