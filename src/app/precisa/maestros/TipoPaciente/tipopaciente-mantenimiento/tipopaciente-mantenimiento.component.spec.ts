import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipopacienteMantenimientoComponent } from './tipopaciente-mantenimiento.component';

describe('TipopacienteMantenimientoComponent', () => {
  let component: TipopacienteMantenimientoComponent;
  let fixture: ComponentFixture<TipopacienteMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipopacienteMantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipopacienteMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
