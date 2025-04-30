import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { IModeloServicio } from '../../ModeloServicio/model/IModeloServicio';
import { TipoAdmisionService } from '../../TipoAdmision/services/TipoAdmision.services';
import { tipoPaciente } from '../model/TipoPaciente';
import { TipoPacienteService } from '../services/TipoPaciente.Services';
import { TipoPacienteMantenimientoComponent } from './components/tipo-paciente-mantenimiento.component';

@Component({
  selector: 'ngx-tipo-paciente',
  templateUrl: './tipo-paciente.component.html',
  styleUrls: ['./tipo-paciente.component.scss']
})
export class TipoPacienteComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(TipoPacienteMantenimientoComponent, { static: false }) tipoPacienteMantenimientoomponent: TipoPacienteMantenimientoComponent;
  bloquearPag: boolean;
  filtro: tipoPaciente = new tipoPaciente();
  lst: any[] = [];
  lstTipoAdmision: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  ltsExportar: MenuItem[];
  verMantPersona: boolean = false;
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string; 
  registroSeleccionado: any;
  loading: boolean;

  constructor(
    private messageService: MessageService,
    private exportarService: ExportarService,    
    private TipoAdmisionService: TipoAdmisionService,
    private TipoPacienteService: TipoPacienteService,
    private confirmationService: ConfirmationService,) {
    super();
  }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    const p4 = this.tituloListadoAsignar(1, this);
    Promise.all([p4]).then(
      f => {
        setTimeout(() => {
          this.cargarFuncionesIniciales();
          this.bloquearPag = false;
        }, 100);
      });
    this.bloquearPag = false;
  }

  async cargarFuncionesIniciales() {
    await this.iniciarComponent();
    await this.cargarEstados();
    await this.comboCargarTipoAdmision();
  }


  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECTOR_SEDES") {
      this.coreBuscar();
    }
  }

  exportExcel() {
  
  }

  exportPdf() {
    if (this.lst == null || this.lst == undefined || this.lst.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {

      var col = [[
        "NRO",
        "FECHA",
        "COMPAÑIA",
        "DESCRIPCION",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lst.forEach(function (e: tipoPaciente) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCreacion);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2); let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar = [
          contador.toString(),
          fechaCreacion,
          e.Codigo,
          e.Descripcion?.toUpperCase() || '',
          e.ESTADOdesc.toString()
        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lst, col, rows, "Sucursales.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }

  }
  
  coreNuevo(): void {
    this.tipoPacienteMantenimientoomponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }

  coreEditar(row) {
    this.tipoPacienteMantenimientoomponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, row);
  }

  coreVer(row) {
    this.tipoPacienteMantenimientoomponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row);
  }

  coreinactivar(row) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: () => {
        row.SedEstado = 2;
        this.TipoPacienteService.MantenimientoTipoPaciente(3, row, this.getUsuarioToken()).then(
          res => {
            if (res != null) {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Anulado con éxito.' });
              this.coreBuscar();
            }
          });
      },
    });
  }

  coreBuscar(): void {
    if (!this.estaVacio(this.filtro.AdmDescripcion)) {
      this.filtro.AdmDescripcion = this.filtro.AdmDescripcion.trim();
    }
    this.bloquearPag = true;
    this.TipoPacienteService.ListaTipoPaciente(this.filtro).then((res) => {
        this.bloquearPag = false;
        var contado = 1;
        res.forEach(element => {
          element.num = contado++;
        });
        this.lst = res;
        console.log("coreBuscar listado:", res);
      });
  }

  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }

  coreExportar(): void {
    if (this.lst == null || this.lst == undefined || this.lst.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: IModeloServicio[] = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lst.forEach(function (e: tipoPaciente) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCreacion);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2); let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar: IModeloServicio = {
          NRO:    contador.toString(),
          FECHA:  fechaCreacion,
          COMPAÑIA: "PRECISA",
          DESCRIPCION: e.AdmDescripcion?.toUpperCase() || '',
          ESTADO: e.ESTADOdesc.toString()
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lst, listaExportar, "TipoPaciente");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });
    }
  }

  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstado.push({ label: i.Nombre, value: i.IdCodigo });
    });
    this.filtro.Estado=1;
  }

  comboCargarTipoAdmision(){
    this.lstTipoAdmision = [];
    let dto = {      AdmEstado: 1    }
    this.lstTipoAdmision.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.TipoAdmisionService.ListaTipoAdmision(dto).then(resp => {
      console.log("combo tipo admision:", resp);
      resp.forEach(e => {
        this.lstTipoAdmision.push({ label: e.AdmDescripcion, value: e.TipoAdmisionId });
      });
    });
  }

  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
  }


}