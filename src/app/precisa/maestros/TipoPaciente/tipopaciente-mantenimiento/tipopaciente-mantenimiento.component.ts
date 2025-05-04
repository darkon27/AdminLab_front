import { Component, OnInit } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { tipoPaciente } from '../model/TipoPaciente';

@Component({
  selector: 'ngx-tipopaciente-mantenimiento',
  templateUrl: './tipopaciente-mantenimiento.component.html',
  styleUrls: ['./tipopaciente-mantenimiento.component.scss']
})
export class TipopacienteMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  titulo: string = ''
  accionRealizar: string = ''
  position: string = 'top'
  bloquearPag: boolean;
  visible: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  dto: tipoPaciente = new tipoPaciente();


  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  

}
