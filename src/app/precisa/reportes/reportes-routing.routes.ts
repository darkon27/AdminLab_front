import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProduccionComponent } from '../liquidacion/produccion/view/produccion.component';
import { BdPacientesMantenimientoComponent } from './bd-pacientes/components/bdpacientes-mantenimiento.component';
import { BdPacientesComponent } from './bd-pacientes/view/bdpacientes.component';
import { ConsultaAtencionesComponent } from './consulta-atenciones/consulta-atenciones.component';
import { EstadisticaPeriodoComponent } from './estadistica-periodo/estadistica-periodo.component';
import { MedicoAtencionesComponent } from './medico-atenciones/medico-atenciones.component';
import { PacientesContratoComponent } from './pacientes-contrato/pacientes-contrato.component';
import { ProduccionTerminadosComponent } from './produccion-terminados/produccion-terminados.component';
import { ProduccionesComponent } from './producciones/producciones.component';
import { ReportesComponent } from './reportes.component';
import { ResumenSustentoTramaComponent } from './resumen-sustento-trama/resumen-sustento-trama.component';


const routes: Routes = [{
  path: '',
  component: ReportesComponent,
  children: [
    {
      path: 'co_atenciones',
      component: BdPacientesComponent,
    },
    {
      path: 'co_liquidaciones',
      component: ProduccionTerminadosComponent,
    },
    {
      path: 'co_ingresocaja',
      component: ResumenSustentoTramaComponent,
    },
    {
      path: 'co_atencionedetalle',
      component: ConsultaAtencionesComponent,
    },
    {
      path: 'co_atencionesxpaciente',
      component: ProduccionesComponent,
    },
    {
      path: 'co_pacientecontrato',
      component: PacientesContratoComponent,
    },
    {
      path: 'co_medicoatenciones',
      component: MedicoAtencionesComponent,
    },
    {
      path: 'co_atencionexamen',
      component: EstadisticaPeriodoComponent,
    },

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule { }

export const routedComponents = [
  ReportesComponent,
  BdPacientesComponent,
  BdPacientesMantenimientoComponent,
  ProduccionTerminadosComponent,
  ResumenSustentoTramaComponent,
  ConsultaAtencionesComponent,
  ProduccionesComponent,
  PacientesContratoComponent,
  MedicoAtencionesComponent,
  EstadisticaPeriodoComponent
];
