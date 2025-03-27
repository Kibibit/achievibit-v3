import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoriesAllComponent } from './repositories-all.component';

describe('RepositoriesAllComponent', () => {
  let component: RepositoriesAllComponent;
  let fixture: ComponentFixture<RepositoriesAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoriesAllComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepositoriesAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
