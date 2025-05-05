import { Component, OnInit, ViewChild } from "@angular/core";
import { SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { PersonaService } from "../../Persona/servicio/persona.service";
import { ExamenService } from "../servicio/Examen.service";

/**
 * autor: Geampier Smc
* Tipo: ciclo de vida
* Detalle: Asigne una forma de manejar mejor la información al llamado de cada componente.
 */

@Component({
  selector: 'ngx-examen-perfil',
  templateUrl: './examen-perfil.component.html'
})
export class ExamenPerfilComponent extends ComponenteBasePrincipal implements  UIMantenimientoController {

  puedeEditar: boolean;
  acciones: string;
  position: string;
  titulo: string;  
  lstperfil: SelectItem[] = [];

  ngOnDestroy() {
    this.acciones = '';
    this.position = 'top';
    this.puedeEditar = false;
    this.titulo = '';
  }

  constructor(
    private ExamenService: ExamenService,
    private personaService: PersonaService
  ) {
    super();
    this.ngOnDestroy();
  }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error("Method not implemented.");
  }

  coreMensaje(mensage: MensajeController): void {}
  coreNuevo(): void {throw new Error("Method not implemented.");}
  coreBuscar(): void { throw new Error("Method not implemented.");}
  coreExportar(): void {throw new Error("Method not implemented.");}
  coreSalir(): void { throw new Error("Method not implemented.");}

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, titulo: string, page: number, dtoEditExamen?: any): void {
    const p1 = null;
    Promise.all([p1]).then(resp => {
      this.mensajeController = mensaje;
      this.acciones = accionform;
      this.titulo = `${titulo}: ${accionform}`;
      this.dialog = true;
      this.puedeEditar = false;
      //console.log("this.mensajeController",       this.mensajeController);

      let objExaPerfil = {
        CodigoComponente: dtoEditExamen.CodigoComponente,
        Estado: 1
      }

      //console.log("Lista objExaHomo", objExaPerfil);
       this.ExamenService.ListadoComponentePerfil(objExaPerfil).then((resMue) => {
          var cont = 1;
          resMue.forEach(element => {
            element.numeroExamen = cont++;
          });
          this.lstperfil = resMue;
          //console.log("Lista lsthomologacion", resMue);
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

        //Esto debe ser al final de todo el proceso
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
