import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { AprobacionEstadoMantenimientoComponent } from '../components/aprobacion-estado-mantenimiento.component';

@Component({
  selector: 'ngx-aprobacion-estado',
  templateUrl: './aprobacion-estado.component.html',
  styleUrls: ['./aprobacion-estado.component.scss']
})
export class AprobacionEstadoComponent  extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController  {


  @ViewChild(AprobacionEstadoMantenimientoComponent, { static: false })  aprobacionEstadoMantenimientoComponent;
  dto:Maestro[]=[]
  
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private toastrService: NbToastrService) {
    super();
  } 
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }
  coreNuevo(): void {
    this.aprobacionEstadoMantenimientoComponent.iniciarComponente("NUEVO",this.objetoTitulo.menuSeguridad.titulo)
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
    //console.log(this.objetoTitulo)
    this.aprobacionEstadoMantenimientoComponent.iniciarComponente("VER",this.objetoTitulo.menuSeguridad.titulo)
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
    this.aprobacionEstadoMantenimientoComponent.iniciarComponente("EDITAR",this.objetoTitulo.menuSeguridad.titulo)
  }


}
