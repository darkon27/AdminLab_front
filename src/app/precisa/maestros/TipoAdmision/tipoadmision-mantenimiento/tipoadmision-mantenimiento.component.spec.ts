import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoadmisionMantenimientoComponent } from './tipoadmision-mantenimiento.component';

describe('TipoadmisionMantenimientoComponent', () => {
  let component: TipoadmisionMantenimientoComponent;
  let fixture: ComponentFixture<TipoadmisionMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoadmisionMantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoadmisionMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
