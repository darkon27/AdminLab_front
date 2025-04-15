import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../../util/MensajeController";



@Component({
    selector: 'ngx-tipo-paciente-mantenimiento',
    templateUrl: './tipo-paciente-mantenimiento.component.html'
  })
export class TipoPacienteMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
 
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  
  acciones: string = ''
  position: string = 'top'

  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any): void {
    //if (accion == "NUEVO") {
      this.cargarAcciones(accion,titulo)

    //}
    
  }

  
  cargarAcciones(accion: string,titulo) {
    this.acciones = `${titulo}: ${accion}`;
   
      this.dialog = true;
      this.puedeEditar = false;
    
  }


}


