import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";
import { MensajeController } from "../../../../../util/MensajeController";
import { AuditoriaComponent } from "../../../../@theme/components/auditoria/auditoria.component";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { PersonaService } from "../../../framework-comun/Persona/servicio/persona.service";
import { FiltroCompaniamast } from "../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { filtroParametros } from "../../Parametros/model/filtro.parametros";
import { Parametros } from "../../Parametros/model/parametros";
import { ParametrosService } from "../../Parametros/service/parametros.service";
import { DtoTipocambiomast } from "../dominio/dto/DtoTipocambiomast";
import { forkJoin } from "rxjs";
import { MaestrotipocambioService } from "../servicio/maestrotipocambio.service";



@Component({
  selector: 'ngx-tipo-cambio-mantenimiento',
  templateUrl: './tipo-cambio-mantenimiento.component.html'
})



export class TipoCambioMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy {
  @ViewChild(AuditoriaComponent, { static: false }) auditoriaComponent: AuditoriaComponent;
  titulo: string = ''
  accionRealizar: string = ''
  position: string = 'top'
  bloquearPag: boolean;
  visible: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  lstEstados: SelectItem[] = [];
  lstCompania: SelectItem[] = [];
  lstMoneda: SelectItem[] = [];

  acciones: string = '';

  validarAccion: string = '';

  checked: boolean = false
  lstTipoDato: SelectItem[] = [];
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: DtoTipocambiomast = new DtoTipocambiomast();
  filtrocompa: FiltroCompaniamast = new FiltroCompaniamast();
  loading: boolean = false;
  puedeEditar: boolean = false;
  NoPuedeEditar: boolean = false;
  minDate: Date;  // Primer día del mes actual
  maxDate: Date;  // Día actual o último día del mes (lo que sea menor)


  calcularFechasPermitidas(): void {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    this.minDate = primerDiaMes;
    this.maxDate = hoy < ultimoDiaMes ? hoy : ultimoDiaMes;
  }

  constructor(
    private _MaestrocompaniaMastService: MaestrocompaniaMastService,
    private _MaestrotipocambioService: MaestrotipocambioService,
    private _MessageService: MessageService,

  ) {
    super();
  }

  ngOnInit(): void {

    this.cargarSelect();
    this.iniciarComponent();
    this.calcularFechasPermitidas();
  }

  ngOnDestroy(): void {
  }

  cargarSelect(): void {
    const optSeleccione = { label: ConstanteAngular.COMBOSELECCIONE, value: null };
    const filtroCompania: FiltroCompaniamast = new FiltroCompaniamast();;
    filtroCompania.estado = 'A'
    forkJoin({
      estados: this.obtenerDataMaestro('ESTLETRAS'),
      monedas: this._MaestrotipocambioService.listarMonedas({ Estado: 'A' }),
      compania: this._MaestrocompaniaMastService.listarCompaniaMast({ estado: 'A' }),
    }
    ).subscribe(resp => {
      this.lstEstados = [optSeleccione, ...resp.estados];
      const dataCompania = resp.compania?.map((ele: any) => ({
        label: ele.DescripcionCorta?.trim()?.toUpperCase() || "", value: `${ele.CompaniaCodigo?.trim() || ""}00`, title: ele.Persona
      }));
      this.lstCompania = [optSeleccione, ...dataCompania];

      const dataMoneda = resp.monedas?.map((ele: any) => ({
        label: ele.DescripcionCorta?.trim()?.toUpperCase().replace('DOLÁRES', 'DÓLARES') || "", value: `${ele.MonedaCodigo?.trim() || ""}`
      }));

      this.lstMoneda = [optSeleccione, ...dataMoneda];
    });
  }

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, titulo: string, page: number, data?: any): void {
    this.bloquearPag = true;
    this.mensajeController = mensaje;
    this.cargarAcciones(accionform, titulo, data)
    this.bloquearPag = false;
  }

  cargarAcciones(accion: string, titulo: string, rowdata?: any) {
    this.titulo = `${titulo}: ${accion}`;
    this.accionRealizar = accion;
    this.dialog = true;

    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.dto = new DtoTipocambiomast();
        this.dto.Estado = "A";
        this.dto.MonedaCodigo = 'EX';
        this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dto.FechaCreacion = new Date();
        this.puedeEditar = false;

        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
        this.fechaModificacion = null;
        break;

      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.dto = rowdata;
        this.dto.FechaCambio = new Date(this.dto.FechaCambio);
        this.puedeEditar = false;
        this.fechaModificacion = new Date();
        this.fechaCreacion = new Date(rowdata.UltimaFechaModif);
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

        this.dto.UltimoUsuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dto.UltimaFechaModif = new Date();
        break;

      case ConstanteUI.ACCION_SOLICITADA_VER:
        this.dto = rowdata;
        this.dto.FechaCambio = new Date(this.dto.FechaCambio);

        this.puedeEditar = true;
        if (rowdata.FechaModificacion == null || rowdata.FechaModificacion == null) { this.fechaModificacion = null; }
        else { this.fechaModificacion = new Date(rowdata.FechaModificacion); }
        this.fechaCreacion = new Date(rowdata.UltimaFechaModif);
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        break;
    }

  }

  async coreGuardar() {
    try {

      if (this.estaVacio(this.dto.MonedaCodigo)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione una moneda válida'); return; }
      if (this.estaVacio(this.dto.FechaCambio)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Ingrese una fecha de cambio válida'); return; }
      if (this.estaVacio(this.dto.Estado)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione una estado válido'); return; }
      if (this.estaVacio(this.dto.FactorCompra)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Ingrese un valor de compra'); return; }
      if (this.estaVacio(this.dto.FactorVenta)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Ingrese un valor de venta'); return; }

      let valorAccionServicio: number = this.accionRealizar == ConstanteUI.ACCION_SOLICITADA_NUEVO ? 1 : 2;
      this.bloquearPag = true;

      const consultaRepsonse = await this._MaestrotipocambioService.MantenimientoTipoCambio(valorAccionServicio, this.dto, this.getUsuarioToken());
      if (consultaRepsonse.success == true) {
        this.MensajeToastComun('notification', 'success', 'Correcto', consultaRepsonse.mensaje);

        this.mensajeController.resultado = consultaRepsonse;
        this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        this.dialog = false;

      } else {
        this.MensajeToastComun('notification', 'warn', 'Advertencia', consultaRepsonse.mensaje);
      }
    }
    catch (error) {
      console.error(error)
      this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
      this.bloquearPag = false;
    } finally {
      this.bloquearPag = false;
    }
  }
  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this._MessageService.clear();
    this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }
}