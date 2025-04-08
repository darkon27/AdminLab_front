import { Component, OnInit } from "@angular/core";
import { SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { ExamenService } from "../servicio/Examen.service";

/**
 * autor: Geampier Smc
* Tipo: ciclo de vida
* Detalle: Asigne una forma de manejar mejor la información al llamado de cada componente.
 */
@Component({
  selector: 'ngx-examen-asignar-muestra',
  templateUrl: './examen-asignar-muestra.component.html'
})
export class ExamenAsignarMuestraComponent extends ComponenteBasePrincipal {

  bloquearPag: boolean;
  acciones: string;
  titulo: string;
  position: string;
  lstmuestra: SelectItem[] = [];
  lstexamen: SelectItem[] = [];

  constructor(
    private ExamenService: ExamenService,
  ) {
    super();
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.acciones = '';
    this.position = 'top';
  }

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, titulo: string, page: number, dtoEditExamen?: any): void {
    const p1 = null;

    Promise.all([p1]).then(resp => {
      this.mensajeController = mensaje;
      this.acciones = accionform;
      this.titulo = `${titulo}: ${accionform}`;
      this.dialog = true;
      this.puedeEditar = false;
      console.log("this.mensajeController",       this.mensajeController);

      this.bloquearPag = true;
      let objMuestra = {
        Estado: 1
      }
      this.ExamenService.listadomuestra(objMuestra).then((res) => {
       var contado = 1;
       res.forEach(element => {
         element.numeroExamen = contado++;
       });
        console.log("Lista Muestra grillaCargarDatos", res);
       this.bloquearPag = false;
       this.lstexamen = res;
     });

     console.log("objet dtoEditExamen ", dtoEditExamen);
     let objExaMuetra = {
       Componente: dtoEditExamen.CodigoComponente,
       Estado: 1
     }
     console.log("Lista objExaMuetra", objExaMuetra);
      this.ExamenService.listadocomponentemuestra(objExaMuetra).then((resMue) => {
         var cont = 1;
         resMue.forEach(element => {
           element.numeroExamen = cont++;
         });
         this.lstmuestra = resMue;
         console.log("Lista lstmuestra", resMue);
       });

    });
  
  }

  
  coreGuardar() {

    switch (this.acciones) {
      case 'NUEVO':

        //Esto debe ser al final de todo el proceso
        this.dialog = false;
        this.puedeEditar = true;
        this.ngOnDestroy();
        break;
      case 'EDITAR':

        //Esto debe ser al final de todo el proceso2
        this.dialog = false;
        this.puedeEditar = true;
        this.ngOnDestroy();
        break;
      default:
        //Esto debe ser al final de todo el proceso
        this.ngOnDestroy();
        return;
    }

  }
}
