import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { FiltroCompaniamast } from "../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { dtoCorrelativo } from "../model/dtoCorrelativo";
import { filtroCorrelativo } from "../model/filtro.Correlativo";
import { CorrelativoService } from "../service/correlativo.Services";



@Component({
    selector: 'ngx-correlativos-mantenimiento',
    templateUrl: './correlativos-mantenimiento.component.html'
  })

export class CorrelativosMantenimientoComponent  extends ComponenteBasePrincipal implements OnInit, OnDestroy,UIMantenimientoController {
  acciones: string = ''
  position: string = 'top'
  bloquearPag: boolean;
  visible: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  lstCompania: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];

  dto: dtoCorrelativo = new dtoCorrelativo();
  filtro: filtroCorrelativo = new filtroCorrelativo();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private CorrelativoService: CorrelativoService,
    private maestrocompaniaMastService: MaestrocompaniaMastService) {
    super();
  }

  ngOnInit(): void {
    this.listaComboTipoComprobante();
    this.cargarEstados();
  }

  async cargarFuncionesIniciales() {
    await this.iniciarComponent();
  }

  cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstado.push({ label: i.Nombre, value: i.Codigo });
    });
  }
  
  
  listaComboTipoComprobante() {
    this.lstTipoComprobante = [];
    this.lstTipoComprobante.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipoComprobante.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("llego cargarComboTipoComprobante", this.lstTipoComprobante);
  }

  listaCombocompania(): Promise<number> {
    this.lstCompania = [];
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
    
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.CompaniaCodigo.trim()+"00", title: ele.Persona });
      });
      return 1;
    });
  }

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, titulo: string, page: number, data?: any): void {
    this.bloquearPag = true;
    const p4 = this.cargarFuncionesIniciales();
    Promise.all([p4]).then(
      f => {
        setTimeout(() => {   
          this.listaCombocompania();
          if (accionform) {
            this.cargarAcciones(accionform,titulo,data)
          }
          this.bloquearPag = false;
        }, 100);
      });
    this.bloquearPag = false;
  }

  cargarAcciones(accion: string, titulo: string, rowdata?: any) {
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false;   
    if (accion == "NUEVO") {
      this.dto.Estado = "A";
      this.puedeEditar = false;
      this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
      this.fechaCreacion = new Date();
    } else if (accion == "EDITAR") {
        console.log("EDITAR FILA :", rowdata);
        this.filtro = rowdata;
        this.bloquearPag = true;
        this.CorrelativoService.ListarCorrelativos(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.dto = res[0];
          this.puedeEditar = false;
          this.fechaModificacion = new Date();
          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        });

    } else if (accion == "VER") {
      console.log("VER FILA :", rowdata);
      this.filtro = rowdata;
      this.bloquearPag = true;
      this.CorrelativoService.ListarCorrelativos(this.filtro).then((res) => {
        this.bloquearPag = false;
        this.dto = res[0];
        this.puedeEditar = true;
        if (res[0].FechaModificacion == null || res[0].FechaModificacion == undefined) {
            this.fechaModificacion = undefined;
          } else {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }
          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        });
    }

  }

  coreMensaje(mensage: MensajeController): void {

  }

  coreGuardar(): void {
    
  }

  ngOnDestroy(): void {
    // this.userInactive.unsubscribe();
  }

  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }

  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }

  coreExportar(): void {
    throw new Error('Method not implemented.');
  }

  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

}


