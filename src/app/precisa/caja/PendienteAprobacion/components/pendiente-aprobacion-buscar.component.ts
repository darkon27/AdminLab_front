import { Component, OnDestroy, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";

@Component({
    selector: 'ngx-pendiente-aprobacion-buscar',
    templateUrl: './pendiente-aprobacion-buscar.component.html'
  })
  
export class PendienteAprobacionBuscarComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController {
  verdocumento: boolean = false;
  vernombre: boolean = true;
  acciones: string = ''
position: string = 'top'
dialog:boolean=false;



ngOnDestroy(): void {
  // this.userInactive.unsubscribe();
}

coreNuevo(): void {
  throw new Error('Method not implemented.');
}

coreBuscar(): void {    
  throw new Error('Method not implemented.');
}

coreMensaje(mensage: MensajeController): void {
  throw new Error('Method not implemented.');
}

coreExportar(): void {
  throw new Error('Method not implemented.');
}

coreSalir(): void {
  throw new Error('Method not implemented.');
}

ngOnInit(): void {
  throw new Error('Method not implemented.');

}

coreGuardar(): void {
  throw new Error('Method not implemented.');
}

coreIniciarComponenteDetalle(mensaje: MensajeController, accionform: string, dtoConsultaDet?: any): void 
{
  
}

  iniciarComponente(accion: string,titulo) {
    this.dialog=true;
    // if (accion == "NUEVO") {
      this.cargarAcciones(accion,titulo)

    
    // else{
    //   this.cargarAcciones(accion,titulo)
    // }
    
  }

  checknombre(hola:any){
    console.log("entro",hola);
    this.vernombre = true;
    this.verdocumento = false;

  }
  checkdocumento(anyd:any){
    this.vernombre = false;
    this.verdocumento = true;
  }
  
  cargarAcciones(accion: string,titulo) {
    this.acciones = `${titulo}: ${accion}`;
   
      this.dialog = true;
      this.puedeEditar = false;
    
  }
}