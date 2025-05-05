import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService, SelectItem, MenuItem} from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { FiltroTipoOAdmision } from '../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision';
import { ConsultaAdmisionService } from '../../../admision/consulta/servicio/consulta-admision.service';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { ModeloServicioMantenimientoComponent } from '../components/modelo-servicio-mantenimiento.component';
import { IModeloServicio } from '../model/IModeloServicio';
import { ModeloServicio } from '../model/ModeloServicio';
import { ModeloServicioService } from '../service/ModeloServicioService';

@Component({
  selector: 'ngx-modelo-servicio',
  templateUrl: './modelo-servicio.component.html'
})
export class ModeloServicioComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(ModeloServicioMantenimientoComponent, { static: false }) modeloServicioMantenimientoComponent: ModeloServicioMantenimientoComponent;
  bloquearPag: boolean;
  filtro: ModeloServicio = new ModeloServicio();
  tipoadmision: FiltroTipoOAdmision = new FiltroTipoOAdmision();
  lstModeloServicio: any[] = [];
  lstTipoAdmision: any[] = [];
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
    private ModeloServicioService: ModeloServicioService,
    private confirmationService: ConfirmationService,
    private consultaAdmisionService: ConsultaAdmisionService) {
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
    if (this.lstModeloServicio == null || this.lstModeloServicio == undefined || this.lstModeloServicio.length == 0) {
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
      this.lstModeloServicio.forEach(function (e: ModeloServicio) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCreacion);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2); let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar = [
          contador.toString(),
          fechaCreacion,
          e.empresa,
          e.MosDescripcion?.toUpperCase() || '',
          e.EstadoDesc.toString()
        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lstModeloServicio, col, rows, "Sucursales.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }

  }
  
  coreNuevo(): void {
    this.modeloServicioMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }

  coreEditar(row) {
    this.modeloServicioMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, row);
  }

  coreVer(row) {
    this.modeloServicioMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row);
  }

  coreinactivar(row) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: () => {
        row.SedEstado = 2;
        this.ModeloServicioService.MantenimientoModeloServicio(3, row, this.getUsuarioToken()).then(
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
    if (!this.estaVacio(this.filtro.MosDescripcion)) {
      this.filtro.MosDescripcion = this.filtro.MosDescripcion.trim();
    }
    this.bloquearPag = true;
    this.ModeloServicioService.ListarModeloServicio(this.filtro).then((res) => {
        this.bloquearPag = false;
        var contado = 1;
        res.forEach(element => {
          element.num = contado++;
        });
        this.lstModeloServicio = res;
        //console.log("coreBuscar listado:", res);
      });
  }

  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }

  coreExportar(): void {
    if (this.lstModeloServicio == null || this.lstModeloServicio == undefined || this.lstModeloServicio.length == 0) {
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
      this.lstModeloServicio.forEach(function (e: ModeloServicio) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCreacion);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2); let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar: IModeloServicio = {
          NRO:    contador.toString(),
          FECHA:  fechaCreacion,
          COMPAÑIA: e.empresa,
          DESCRIPCION: e.MosDescripcion?.toUpperCase() || '',
          ESTADO: e.EstadoDesc.toString()
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lstModeloServicio, listaExportar, "ModeloServicio");
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
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstado.push({ label: i.Nombre, value: i.IdCodigo });
    });
    this.filtro.MosEstado=1;
  }

  comboCargarTipoAdmision(){
    this.lstTipoAdmision = [];
    this.tipoadmision.AdmEstado=1;
    this.lstTipoAdmision.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.consultaAdmisionService.listarcombotipoadmision(this.tipoadmision).then(resp => {
      //console.log("combo tipo admision:", resp);
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