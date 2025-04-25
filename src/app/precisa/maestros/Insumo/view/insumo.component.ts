import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../FormMaestro/model/maestro';
import { InsumoMantenimientoComponent } from '../components/insumo-mantenimiento.component';

@Component({
  selector: 'ngx-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.scss']
})
export class InsumoComponent  extends ComponenteBasePrincipal implements OnInit,UIMantenimientoController {


  @ViewChild(InsumoMantenimientoComponent, { static: false }) insumoMantenimientoComponent: InsumoMantenimientoComponent;
  
  
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
    this.insumoMantenimientoComponent.iniciarComponente("NUEVO",this.objetoTitulo.menuSeguridad.titulo)
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

  coreVer(dto){
    console.log(this.objetoTitulo)
    this.insumoMantenimientoComponent.iniciarComponente("VER",this.objetoTitulo.menuSeguridad.titulo)
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

  coreEditar(dto){
    this.insumoMantenimientoComponent.iniciarComponente("EDITAR",this.objetoTitulo.menuSeguridad.titulo)
  }

}