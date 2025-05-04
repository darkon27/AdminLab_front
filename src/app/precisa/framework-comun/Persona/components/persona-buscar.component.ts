import { Component, OnInit, ViewChild } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { LazyLoadEvent, Message, MessageService, SelectItem } from "primeng/api";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from "primeng/table";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { FiltroPersona } from "../../../maestros/persona/dominio/filtro/FiltroPersona";
import { dtoPersona } from "../dominio/dto/dtoPersona";
import { PersonaService } from "../servicio/persona.service";
import Swal from "sweetalert2";

@Component({
  selector: 'ngx-persona-buscar',
  templateUrl: './persona-buscar.component.html',
  styleUrls: ['./persona-buscar.component.scss']
})
export class PersonaBuscarComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  @ViewChild('myselect') myselect;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;

  mensajeController: MensajeController

  dto: dtoPersona = new dtoPersona();
  filtro: FiltroPersona = new FiltroPersona();

  lstTipoDocumento: SelectItem[] = [];
  EnterPersona: SelectItem[] = [];
  lstPersona: any[] = [];
  bloquearPag: boolean;
  editarRuc: boolean = false;
  editarCampos: boolean = false;
  editarTipoDocumento: boolean = false;
  verdocumento: boolean = false;
  vernombre: boolean = true;
  acciones: string = ''
  position: string = 'top'
  dialog: boolean = false;
  loading: boolean;
  // isLoading: boolean;
  selectedTipoDocumento = "";
  selectedPort = "";
  // paginacion: DominioPaginacion = new DominioPaginacion();
  titulo: string;
  vEsEmpleado: string;
  validarBusPer: FormGroup;
  validarBusDocPer: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private personaService: PersonaService,
    private toastrService: NbToastrService,
    protected messageService: MessageService,
  ) { super(); }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error("Method not implemented.");
  }

  coreBuscar(): void {
    throw new Error("Method not implemented.");
  }
  coreBusquedaRapida(filtro: string): void {
    throw new Error("Method not implemented.");
  }
  coreFiltro(flag: boolean): void {
    throw new Error("Method not implemented.");
  }
  coreAccion(accion: string): void {
    throw new Error("Method not implemented.");
  }




  ngOnInit(): void {
    this.dialog = false;
    this.titulo = '';
    this.ValidarBusPersona();
    const p1 = this.listaComboTipoDocumento();
    Promise.all([p1]).then(resp => {

    });
  }

  ValidarBusPersona() {   
      if(this.estaVacio(this.dto.TipoDocumento)){
        this.validarBusPer = this.formBuilder.group({
          nombre: ['', [Validators.required, Validators.minLength(2)]]
        })
      }
      if(this.estaVacio(this.dto.NombreCompleto)){
        this.validarBusDocPer = this.formBuilder.group({
        documento: ['', [Validators.required, Validators.minLength(5)]]
        })
     }
  }
  
  get nombreField() {
    return this.validarBusPer.get('nombre');
  }
  get documentoField() {
    return this.validarBusDocPer.get('documento');
  }

  coreNuevo(): void {
    throw new Error("Method not implemented.");
  }

  coreBuscare() {
    if (this.validarBusPer.valid || this.validarBusDocPer.valid) {
      this.dataTableComponent.first = 0;
      this.grillaCargarDatos({ first: this.dataTableComponent.first });
    } else {
      this.validarBusPer.markAllAsTouched();
      this.validarBusDocPer.markAllAsTouched();
    }
  }

  coreGuardar(): void {
    throw new Error("Method not implemented.");
  }


  coreMensaje(mensage: MensajeController): void {
    // if(mensage.componente == "TIPREGPERSONA") {
    //   console.log("data del seleccionar",mensage);
    //   this.filtro.Documento=mensage.resultado.Documento;
    //   this.filtro.NombreCompleto=mensage.resultado.NombreCompleto;
    //   this.filtro.FechaNacimiento=mensage.resultado.FechaNacimiento;

    // }
  }
  coreExportar(): void {
    throw new Error("Method not implemented.");
  }

  coreSalir() {
    // this.mensajeController.componenteDestino.desbloquearPagina();
    this.dialog = false;
  };

  coreSeleccionar(dto: any) {
    if (dto === null) {
      this.mostrarMensajeInfo('Debe seleccionar un registro');
      return;
    }
    this.mensajeController.resultado = dto;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    console.log("data del persona", dto)
    this.coreSalir();
    this.limpiarBuscador();
  }


  mostrarMensajeInfo(mensaje: string): void {
    this.mostrarMensaje(mensaje, 'info');
  }

  mostrarMensaje(mensaje: string, tipo: string): void {
    this.messageService.clear();
    this.messageService.add({ severity: tipo, summary: 'Mensaje', detail: mensaje });
  }

  validarTeclaEnter(event) {
    if (event.key == "Enter") {
       console.log("Buscar Enter", event)
      this.coreBuscare();
    }
  }

  selectedItemTipoDocumento(event) {
    this.selectedTipoDocumento = event.value
    this.dto.Documento = null;
    this.dto.TipoDocumento = this.selectedTipoDocumento;
  }

  esRUCesDNIValido(event) {
    if (this.selectedTipoDocumento == "R" || this.selectedTipoDocumento == "D") {
      let key;
      console.log("event", event)
      if (event.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
       // console.log("key if", key)
      } else {
        key = event.keyCode;
        key = String.fromCharCode(key);
      }
      const regex = /[0-9]|\./;
      if (!regex.test(key)) {
        event.returnValue = false;
        if (event.preventDefault) {
          event.preventDefault();
        }
      }
    }
  }


  grillaCargarDatos(event: LazyLoadEvent) {
    this.bloquearPag = true;
      this.dto.TipoPersona = "N";
      this.dto.Estado = "A";
      this.dto.EsEmpleado = this.vEsEmpleado;
      console.log("Buscar Persona grillaCargarDatos :: ",this.dto);
      this.personaService.listarpaginado(this.dto).then((res) => { 
      var contado = 1;
      console.log("Buscar listado:", res);
      this.lstPersona = res;
      if (!this.esListaVacia(this.lstPersona)){
        res.forEach(element => {
          element.numeropersona = contado++;
        });
      }
      this.bloquearPag = false; 
    });
  }

  limpiarBuscador() {
    this.lstPersona = [];
    this.selectedTipoDocumento == null;
    this.dto.NombreCompleto = null;
    this.dto.TipoDocumento = null;
    this.dto.Documento = null;
    this.checknombre(event);
    this.loading = false;
  }

  iniciarComponente(accion: string, titulo) {
    this.cargarAcciones(accion, titulo)
    this.coreIniciarComponente
  }

  coreIniciarComponente(msj: MensajeController, accionform: string, EsEmpleado: string) {
    this.mensajeController = msj;
    this.dialog = true;
    this.limpiarBuscador();
    this.titulo = 'EMPLEADOS';
    this.vEsEmpleado = EsEmpleado;
    this.acciones = `${this.titulo}: ${accionform}`;
    this.filtro = new FiltroPersona();
  }

  checknombre(hola: any) {
    this.vernombre = true;
    this.verdocumento = false;
    this.dto.TipoDocumento = null;
    this.dto.Documento = null;
    this.ValidarBusPersona();
  }

  checkdocumento(anyd: any) {
    this.vernombre = false;
    this.verdocumento = true;
    this.dto.NombreCompleto = null; 
    this.ValidarBusPersona();
  }

  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false;

  }
  listaComboTipoDocumento() {

    this.lstTipoDocumento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIPODOCIDENTID").forEach(i => {
      this.lstTipoDocumento.push({ label: i.Nombre, value: i.Codigo })

    });
  }

  ondobleRowDblclick(rowData: any) {
    if (rowData === null) {
        this.mostrarMensajeInfo('Debe seleccionar un registro');
        return;
    } else {
      const env:Object[] = [rowData];
        this.mensajeController.resultado = rowData;
        this.coreSalir();
        console.log(" this.mensajeController:",  this.mensajeController);
        this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    }
}

}


