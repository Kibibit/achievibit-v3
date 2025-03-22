import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileIntegrationsComponent } from './profile-integrations.component';

describe('ProfileIntegrationsComponent', () => {
  let component: ProfileIntegrationsComponent;
  let fixture: ComponentFixture<ProfileIntegrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileIntegrationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
