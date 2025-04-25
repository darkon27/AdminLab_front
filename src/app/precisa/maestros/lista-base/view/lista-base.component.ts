import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ExamenService } from '../../../framework-comun/Examen/servicio/Examen.service';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { ListaBaseMantenimientoComponent } from '../components/lista-base-mantenimiento.component';
import { IdListaBase } from '../model/IListaBase';
import { listabase } from '../model/listabase';
import { listabaseServices } from '../service/listabase.service';

@Component({
  selector: 'ngx-lista-base',
  templateUrl: './lista-base.component.html',
  styleUrls: ['./lista-base.component.scss']
})
export class ListaBaseComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController{
  @ViewChild(ListaBaseMantenimientoComponent, { static: false }) listaBaseMantenimientoComponent: ListaBaseMantenimientoComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  bloquearPag: boolean;
  filtro: listabase = new listabase();
  lstlistabase: any[] = [];
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
    private listabaseServices: listabaseServices,
    private ExamenService: ExamenService,    
    private confirmationService: ConfirmationService) {
    super();
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    const p1 = this.cargarEstados();
    this.ltsExportar = [
      {
        label: "Formato PDF",
        icon: "pi pi-file-pdf",
        command: () => {
          this.exportPdf();
        },
      },
      {
        label: "Formato EXCEL",
        icon: "pi pi-file-excel",
        command: () => {
          this.exportExcel();
        },
      },
    ];
    Promise.all([p1]).then((resp) => {
      this.bloquearPag = false;
    });
  }

  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECTOR_SEDES") {
      this.coreBuscar();
    }
  }

  exportExcel() {
    if (this.lstlistabase == null || this.lstlistabase == undefined || this.lstlistabase.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: IdListaBase[] = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstlistabase.forEach(function (e: listabase) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCreacion);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2); let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar: IdListaBase = {
          NRO: contador.toString(),
          FECHA: fechaCreacion,
          CODIGO: e.Codigo,
          DESCRIPCION: e.Descripcion?.toUpperCase() || '',
          ESTADO: e.Estado.toString()
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lstlistabase, listaExportar, "Sucursales");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });
    }
  }

  //pdf

  exportPdf() {
    if (this.lstlistabase == null || this.lstlistabase == undefined || this.lstlistabase.length == 0) {
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
        "CODIGO",
        "TELEFONO",
        "SUCURSAL",
        "DIRECCION",
        "COMPAÑIA",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstlistabase.forEach(function (e: listabase) {
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
          e.Estado.toString()
        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lstlistabase, col, rows, "Sucursales.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }

  }

  coreNuevo(): void {
    this.listaBaseMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_SEDES', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }
  coreEditar(row) {
    this.listaBaseMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_SEDES', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, row);
  }
  coreVer(row) {
    this.listaBaseMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_SEDES', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row);
  }

  coreinactivar(row) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: () => {
        row.SedEstado = 2;
        this.ExamenService.MantenimientoBaseComponente(3, row, this.getUsuarioToken()).then(
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
    if (!this.estaVacio(this.filtro.Descripcion)) {
      this.filtro.Descripcion = this.filtro.Descripcion.trim();
    }
    if (!this.estaVacio(this.filtro.Codigo)) {
      this.filtro.Codigo = this.filtro.Codigo.trim();
    }
    this.bloquearPag = true;
    this.ExamenService.ListadoBaseComponente(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lstlistabase = res;
      console.log("coreBuscar listado:", res);
    });
  }

  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }

  coreExportar(): void {
    throw new Error('Method not implemented.');
  }
  
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }


  cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstado.push({ label: i.Nombre, value: i.IdCodigo });
    });
  }

  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
  }

}