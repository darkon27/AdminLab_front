import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenMantenimientoComponentVista } from './examen-mantenimiento.component';

describe('ExamenMantenimientoComponent', () => {
  let component: ExamenMantenimientoComponentVista;
  let fixture: ComponentFixture<ExamenMantenimientoComponentVista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamenMantenimientoComponentVista ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamenMantenimientoComponentVista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
