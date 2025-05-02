import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { BdPacientesMantenimientoComponent } from '../components/bdpacientes-mantenimiento.component';



@Component({
  selector: 'ngx-bdpacientes',
  templateUrl: './bdpacientes.component.html',
  styleUrls: ['./bdpacientes.component.scss']
})
export class BdPacientesComponent extends ComponenteBasePrincipal  implements OnInit,UIMantenimientoController {


  @ViewChild(BdPacientesMantenimientoComponent, { static: false }) bdPacientesMantenimientoComponent: BdPacientesMantenimientoComponent; 
  dto:Maestro[]=[]
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private toastrService: NbToastrService) {
    super();
  }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreNuevo(): void {
    this.bdPacientesMantenimientoComponent.iniciarComponente("NUEVO",this.objetoTitulo.menuSeguridad.titulo)
  }
  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  coreVer(dto): void{
    this.bdPacientesMantenimientoComponent.iniciarComponente("VER",this.objetoTitulo.menuSeguridad.titulo)
  }

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    let dw = new Maestro()
    dw.CodigoTabla="01"
    dw.Descripcion="PRUEBA DESCRI"
    dw.Nombre="NOMBRE DETALLE"
    dw.Estado=2
    this.dto.push(dw)

  }
  coreEditar(dto): void{
    this.bdPacientesMantenimientoComponent.iniciarComponente("EDITAR",this.objetoTitulo.menuSeguridad.titulo)
  }

}
