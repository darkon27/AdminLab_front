import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../../util/ComponenteBasePrincipa";



@Component({
    selector: 'ngx-cuenta-bancaria-mantenimiento',
    templateUrl: './cuenta-bancaria-mantenimiento.component.html'
  })
export class CuentaBancariaMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
 
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  
  acciones: string = ''
  position: string = 'top'

  iniciarComponente(accion: string,titulo) {
    // if (accion == "NUEVO") {
      this.cargarAcciones(accion,titulo)

    
    // else{
    //   this.cargarAcciones(accion,titulo)
    // }
    
  }

  
  cargarAcciones(accion: string,titulo) {
    this.acciones = `${titulo}: ${accion}`;
   
      this.dialog = true;
      this.puedeEditar = false;
    
  }


}


