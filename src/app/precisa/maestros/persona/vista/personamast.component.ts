import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { dtoPersona } from '../../../framework-comun/Persona/dominio/dto/dtoPersona';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { FiltroPersona } from '../dominio/filtro/FiltroPersona';
import Swal from 'sweetalert2';
import { PersonaMantenimientoComponent } from '../../../framework-comun/Persona/vista/persona-mantenimiento.component';
import { PersonamastUnificacionComponent } from '../components/personamast-unificacion/personamast-unificacion.component';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-personamast',
  templateUrl: './personamast.component.html',
  styleUrls: ['./personamast.component.scss']
})
export class PersonamastComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;
  @ViewChild(PersonamastUnificacionComponent, { static: false }) personamastunificacionComponent: PersonamastUnificacionComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  bloquearPag: boolean;
  filtro: FiltroPersona = new FiltroPersona();
  lstPersona: any[] = [];
  lstEstados: SelectItem[] = [];
  lstTipoDocumento: SelectItem[] = [];
  lstTipoPersona: SelectItem[] = [];
  lstSexo: SelectItem[] = [];
  lstTipoAdmision: SelectItem[] = [];
  lstDepartamento: SelectItem[] = [];
  lstProvincia: SelectItem[] = [];
  lstDistrito: SelectItem[] = [];
  verMantPersona: boolean = false;
  dto: dtoPersona = new dtoPersona();
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string;
  esCliente: boolean = false;
  esProveedor: boolean = false;
  esEmpleado: boolean = false;
  esOtro: boolean = false;
  selectedPort = "";
  editarTipoDocumento: boolean = false;
  validarmaxtexto: number;
  validarmintexto: number;
  verDocumento: boolean = false;
  ocultarApeMat: boolean = false;
  oculApeMatExt: boolean = false;
  editarCampos: boolean = false;
  verApeMat: boolean = false;
  selectedFechaNacimiento = new Date();
  editarPassword: boolean = false;
  verValidarTipoPersona: boolean = false;
  verValidarTelefono: boolean = false;
  verValidarDireccion: boolean = false;
  selectedEstado = "";
  verValidarEstado: boolean = false;
  selectedTipoDocuemento = "";
  verRuc: boolean = false;
  registroSeleccionado: any;
  loading: boolean;

  @ViewChild('myTipoPersona', { static: false }) myTipoPersona: ElementRef;
  @ViewChild('myDocumento', { static: false }) myDocumento: ElementRef;


  constructor(
    private messageService: MessageService,
    private personaService: PersonaService) {
    super();
  }

  ngOnInit(): void {

    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    const p1 = this.listarComboEstados();
    const p2 = this.listaComboTipoPersona();
    const p3 = this.listaComboTipoDocumento();

    Promise.all([p1, p2, p3]).then(resp => {
      this.bloquearPag = false;
      this.filtro.Estado = 'A';
    });

  }

  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      this.coreBuscar();
    }
  }


  coreBuscar(): void {
    this.dataTableComponent.first = 0;
    this.grillaCargarDatos({ first: this.dataTableComponent.first });
  }

  coreNuevo(): void {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONA', ''), "NUEVO", 1);
  }

  coreHomologar(): void {
    console.log("coreHomologar");
    this.personamastunificacionComponent.cargarAcciones(new MensajeController(this, 'TIPMAPERSONA', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo);
  }

  coreGuardar(): void {
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
  /**
    * Mensaje de confirmación agregado en base a solicitud AD-136
    */
  confirmarCoreEditar(row: dtoPersona) {

    Swal.fire({
      title: '¡Importante!',
      text: "¿Está seguro de modificar los datos del paciente? \n Los cambios podrían afectar a peticiones existentes",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#094d74',
      cancelButtonColor: '#ffc72f',
      cancelButtonText: 'No, Cancelar!',
      confirmButtonText: 'Si, modificar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.coreEditar(row);
      }
    });

  }

  coreEditar(row: dtoPersona) {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONA', ''), "EDITAR", 1, row);
  }

  coreVer(row: dtoPersona) {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONA', ''), "VER", 1, row);
  }

  invactivarProduct(product: dtoPersona) {
    Swal.fire({
      title: '¡Mensaje!',
      text: '¿Desea inactivar Codigo: ' + product.Documento + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#094d74',
      cancelButtonColor: '#ffc72f',
      cancelButtonText: '¡No, Cancelar!',
      confirmButtonText: '¡Si, Anular!'
    }).then((result) => {
      if (result.isConfirmed) {
        product.Estado = "I";
        return this.personaService.mantenimientoMaestro(3, product, this.getUsuarioToken()).then(
          res => {
            if (res.success) {
              this.toastMensaje(`El Registro Nro. ${product.Persona} fue inactivado`, 'success', 2000)
              this.dialog = false;
            } else {
              Swal.fire({
                icon: 'warning',
                title: '¡Mensaje!',
                text: `${res.message}`
              })
            }
          }
        ).catch(error => error)
      }
    })
  }


  enDesarrollo() {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'EN DESARROLLO',
      showConfirmButton: false,
      timer: 1500
    })
  }

  Salirmodal() {
    this.verMantPersona = false;
  }


  grillaCargarDatos(event: LazyLoadEvent) {

    if (this.estaVacio(this.filtro.TipoPersona)) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Debe Selecionar el tipo de Persona.' });
      this.myTipoPersona.nativeElement.focus();
      return;
    }

    if (this.estaVacio(this.filtro.Documento) && this.estaVacio(this.filtro.NombreCompleto)) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Debe ingresar N° Documento /o Nombre.' });
      this.myDocumento.nativeElement.focus();
      return;
    }

    this.bloquearPag = true;
    this.personaService.listarpaginado(this.filtro).then((res) => {
      console.log("res:", res);
      this.bloquearPag = false;
      if (!this.esListaVacia(res)) {
        var contado = 1;
        res.forEach(element => {
          element.numeropersona = contado++;
        });
        if (this.estaVacio(res[0].NombreCompleto)) {
          res[0].NombreCompleto = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`

        }
        this.lstPersona = res;
      } else {
        this.lstPersona = [];
      }

    });
  }

  listaComboTipoPersona() {
    this.lstTipoPersona.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOPERSONA").forEach(i => {
      this.lstTipoPersona.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  listarComboEstados() {
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstEstados.push({ label: 'Activo', value: "A" });
    this.lstEstados.push({ label: 'Inactivo', value: "I" });
  }

  listaComboTipoDocumento() {
    this.lstTipoDocumento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPODOCIDENTID").forEach(i => {
      this.lstTipoDocumento.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  defaultBuscar(event) {
    if (event.keyCode === 13) {

      this.coreBuscar();
    }
  }

  selectedItemTipoPersona(event) {
    this.selectedPort = event.value; //event.originalEvent.srcElement.innerText;
    if (this.selectedPort == "J") {
      this.filtro.TipoDocumento = "R"
      this.editarTipoDocumento = true;

    } else {
      this.editarTipoDocumento = false;
    }
  }

  onRowSelect(event: any) {
    console.log("seleccion:", event);
    console.log("Persona onRowSelect:", this.registroSeleccionado);
  }

}
