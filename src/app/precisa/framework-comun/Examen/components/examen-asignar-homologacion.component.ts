import { Component, OnInit, ViewChild } from "@angular/core";
import { SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { FiltroPacienteClinica } from "../../../admision/paciente-clinica/dominio/filtro/FiltroPacienteClinica";
import { EmpresaBuscarComponent } from "../../Empresa/view/empresa-buscar.component";
import { PersonaService } from "../../Persona/servicio/persona.service";
import { ExamenService } from "../servicio/Examen.service";


/**
 * autor: Geampier Smc
* Tipo: ciclo de vida
* Detalle: Asigne una forma de manejar mejor la información al llamado de cada componente.
 */

@Component({
  selector: 'ngx-examen-asignar-homologacion',
  templateUrl: './examen-asignar-homologacion.component.html'
})
export class ExamenAsignarHomologacionComponent extends ComponenteBasePrincipal implements UIMantenimientoController {
  @ViewChild(EmpresaBuscarComponent, { static: false }) empresaBuscarComponent: EmpresaBuscarComponent;
  editarCampoEmpresa: boolean;
  editarCampos: boolean;
  filtro: FiltroPacienteClinica;
  acciones: string;
  position: string;
  titulo: string;
  lsthomologacion: SelectItem[] = [];


  ngOnDestroy() {
    this.acciones = '';
    this.position = 'top';
    this.editarCampos = false;
    this.editarCampoEmpresa = false;
    this.titulo = '';
    this.filtro = new FiltroPacienteClinica();
  }

  constructor(
    private ExamenService: ExamenService,
    private personaService: PersonaService
  ) {
    super();
    this.ngOnDestroy();
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

      let objExaHomo = {
        CodigoComponente: dtoEditExamen.CodigoComponente,
        Estado: 1
      }
      console.log("Lista objExaHomo", objExaHomo);
       this.ExamenService.ListadoComponenteHomologacion(objExaHomo).then((resMue) => {
          var cont = 1;
          resMue.forEach(element => {
            element.numeroExamen = cont++;
          });
          this.lsthomologacion = resMue;
          console.log("Lista lsthomologacion", resMue);
        });
    });

  }

  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECEMPRESA") {
      if (mensage.resultado.DocumentoFiscal != null) {
        this.filtro.Documento = mensage.resultado.DocumentoFiscal;
      } else {
        this.filtro.Documento = mensage.resultado.Documento;
      }
      this.filtro.NombreCompleto = mensage.resultado.NombreCompleto;
      this.filtro.Persona = mensage.resultado.Persona;
      this.editarCampoEmpresa = true;
      console.log("selec empresa", mensage.resultado)
      // console.log("datoscombo",mensage.resultado.Persona)
    }
  }
  coreNuevo(): void {
    throw new Error("Method not implemented.");
  }
  coreBuscar(): void {
    throw new Error("Method not implemented.");
  }

  coreExportar(): void {
    throw new Error("Method not implemented.");
  }
  coreSalir(): void {
    throw new Error("Method not implemented.");
  }

  verSelectorEmpresa(): void {
    // this.personaBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
    this.empresaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECEMPRESA', 'BUSCAR'), 'BUSCAR');
  }


  limpiarEmpresa() {
    this.filtro.Documento = null;
    this.filtro.NombreCompleto = null;
    this.editarCampoEmpresa = false;
  }
  validarTeclaEnterEmpresaAseguradora(evento) {
    var filtro = new FiltroPacienteClinica();
    if (this.filtro.Documento == null) {
      this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
      return;
    }
    if (this.filtro.Documento.length < 11) {
      this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      this.filtro.Documento == null;
      return;
    }
    if (evento.key == "Enter") {
      if (this.filtro.Documento.length == 11) {
        filtro.Documento = this.filtro.Documento.trim();
        filtro.TipoDocumento = "R";
        this.personaService.listarpaginado(filtro).then((res) => {
          console.log("enter empresa", res)
          if (res.length > 0) {
            this.filtro.NombreCompleto = res[0].NombreCompleto;
            this.filtro.Persona = res[0].Persona;
            this.editarCampoEmpresa = true;

          } else {
            this.filtro.Documento = null;
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
          }
        });
      }
    }
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
