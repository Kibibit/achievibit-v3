import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsAllComponent } from './organizations-all.component';

describe('OrganizationsAllComponent', () => {
  let component: OrganizationsAllComponent;
  let fixture: ComponentFixture<OrganizationsAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OrganizationsAllComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrganizationsAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
