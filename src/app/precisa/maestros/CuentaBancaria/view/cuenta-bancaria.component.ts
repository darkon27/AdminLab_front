import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../FormMaestro/model/maestro';
import { CuentaBancariaBuscarComponent } from './components/cuenta-bancaria-buscar.component';
import { CuentaBancariaMantenimientoComponent } from './components/cuenta-bancaria-mantenimiento.component';

@Component({
  selector: 'ngx-cuenta-bancaria',
  templateUrl: './cuenta-bancaria.component.html',
  styleUrls: ['./cuenta-bancaria.component.scss']
})
export class CuentaBancariaComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController{
 
  @ViewChild(CuentaBancariaMantenimientoComponent, { static: false }) componentMantenimientoComponent: CuentaBancariaMantenimientoComponent;
  @ViewChild(CuentaBancariaBuscarComponent, { static: false }) componentBuscarComponent: CuentaBancariaBuscarComponent;
  
  tipocambio:number=4.00
  igv:0.18

  dto: Maestro[]=[];
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
  coreBuscar(): void {
    throw new Error('Method not implemented.');
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

  coreNuevo(): void {
    this.componentMantenimientoComponent.iniciarComponente("NUEVO",this.objetoTitulo.menuSeguridad.titulo)
    
  }
  
  verSelectorEmpresa(): void {
     this.componentBuscarComponent.iniciarComponente("BUSCADOR EMPRESAS", this.objetoTitulo.menuSeguridad.titulo)
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

  coreEditar(dto): void{
    this.componentMantenimientoComponent.iniciarComponente("EDITAR",this.objetoTitulo.menuSeguridad.titulo)

  }
  coreVer(dto): void{
    //console.log(this.objetoTitulo)
    this.componentMantenimientoComponent.iniciarComponente("VER",this.objetoTitulo.menuSeguridad.titulo)
  }


  //openNew() {
    //this.componentMantenimientoComponent.iniciarComponente("NUEVO",this.objetoTitulo.menuSeguridad.titulo)
    
  //}
  
 
}
