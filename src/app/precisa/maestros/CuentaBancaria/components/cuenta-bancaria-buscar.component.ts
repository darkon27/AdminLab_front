import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";



@Component({
  selector: 'ngx-cuenta-bancaria-buscar',
  templateUrl: './cuenta-bancaria-buscar.component.html'
})
export class CuentaBancariaBuscarComponent extends ComponenteBasePrincipal implements OnInit {

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  verdocumento: boolean = false;
  vernombre: boolean = true;
  acciones: string = ''
  position: string = 'top'
  dialog: boolean = false;
  iniciarComponente(accion: string, titulo) {
    this.dialog = true;
    // if (accion == "NUEVO") {
    this.cargarAcciones(accion, titulo)


    // else{
    //   this.cargarAcciones(accion,titulo)
    // }

  }

  checknombre(hola: any) {
    //console.log("entro",hola);
    this.vernombre = true;
    this.verdocumento = false;

  }
  checkdocumento(anyd: any) {
    this.vernombre = false;
    this.verdocumento = true;
  }

  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;

    this.dialog = true;
    this.puedeEditar = false;

  }
}