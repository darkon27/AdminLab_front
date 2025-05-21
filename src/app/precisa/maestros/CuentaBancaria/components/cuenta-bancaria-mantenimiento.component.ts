import { Component, OnInit, ViewChild } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MessageService, SelectItem } from "primeng/api";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";
import { forkJoin } from "rxjs";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { CuentaBancaria } from "../model/Cuenta-Bancaria";
import { CuentaBancariaService } from "../services/cuenta-bancaria.service";
import { MaestrotipocambioService } from "../../TipoCambio/servicio/maestrotipocambio.service";
import { FormGroup } from "@angular/forms";

@Component({
    selector: 'ngx-cuenta-bancaria-mantenimiento',
    templateUrl: './cuenta-bancaria-mantenimiento.component.html'
  })
export class CuentaBancariaMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  @ViewChild(CuentaBancariaMantenimientoComponent, { static: false }) componentMantenimientoComponent: CuentaBancariaMantenimientoComponent;
  @ViewChild(CuentaBancariaMantenimientoComponent, { static: false }) componentBuscarComponent: CuentaBancariaMantenimientoComponent;
  titulo: string = ''
    accionRealizar: string = ''
    position: string = 'top'
    bloquearPag: boolean;
    visible: boolean;
    usuario: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    cuentaBancaria : string;
    descripcion : string;
    fechaApertura: string | Date;
    fechaCierreCuenta: string | Date;
    tipoCuenta : string;
    cuentaContable : string;
    cuentaBancariaConsolidada : string;

    lstTipoCuenta: SelectItem[] = [];
    lstMoneda: SelectItem[] = [];
    lstBanco: SelectItem[] = [];
    lstTipoCambio: SelectItem[] = [];
    lstEstado: SelectItem[] = [];
    dto: CuentaBancaria = new CuentaBancaria();

  
  constructor(
      private _MessageService: MessageService,
      private _CuentaBancariaService: CuentaBancariaService,
      private _MaestrotipocambioService: MaestrotipocambioService,
  
    ) {
      super();
    }

  ngOnInit(): void {
    this.cargarSelect();
    this.iniciarComponent();
  }
  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOTODOS, value: null };
    forkJoin({
      estados: this.obtenerDataMaestro('ESTGEN'),
      bancos: this.obtenerDataMaestro('BANCO'),
      monedas: this._MaestrotipocambioService.listarMonedas({ Estado: 'A' }),
      tipoCambio: this.obtenerDataMaestro('TIPCAM'),
      tipoCuenta: this.obtenerDataMaestro('TIPCUENTA'),
    }
    ).subscribe(resp => {
      const dataEstados = resp.estados?.map((ele: any) => ({
        label: ele.label?.trim()?.toUpperCase() || "", value: Number.parseInt(ele.value)
      }));
      this.lstEstado = [optTodos, ...dataEstados];
      const dataBancos = resp.bancos?.map((ele: any) => ({
        label: ele.label?.trim()?.toUpperCase() || "", value: Number.parseInt(ele.value)
      }));
      this.lstBanco = [optTodos, ...dataBancos];
      const dataMonedas = resp.monedas?.map((ele: any) => ({
        label: ele.DescripcionCorta?.trim()?.toUpperCase().replace('DOLÁRES', 'DÓLARES') || "", value: `${ele.MonedaCodigo?.trim() || ""}`
      }));
      this.lstMoneda = [optTodos, ...dataMonedas];
      const dataTipoCambio = resp.tipoCambio?.map((ele: any) => ({
        label: ele.label?.trim()?.toUpperCase() || "", value: Number.parseInt(ele.value)
      }));
      this.lstTipoCambio = [optTodos, ...dataTipoCambio];
      const dataTipoCuenta = resp.tipoCuenta?.map((ele: any) => ({
        label: ele.label?.trim()?.toUpperCase() || "", value: Number.parseInt(ele.value)
      }));
    });
  }

  verEmpresa(){
    this.componentBuscarComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_NUEVO + 'CUENTABANCARIA', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo, 0, {});
  }

  
  acciones: string = ''

  iniciarComponente(accion: string,titulo) {
    if (accion == "NUEVO") {
      this.cargarAcciones(accion,titulo)}

    
    // else{
    //   this.cargarAcciones(accion,titulo)
    // }
    
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
          this.dto = new CuentaBancaria();
          this.dto.Estado = "A";
          this.dto.MonedaCodigo = 'EX';
          this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].NombreCompleto.trim();
          this.dto.FechaCreacion = new Date();
          this.dto.FechaApertura = new Date();
          this.dto.TipoCuenta;
          this.dto.CuentaBancaria;
          this.dto.CuentaContable;
          this.dto.CuentaBancariaConsolidada; 
          this.dto.CuentaBancariaOriginal;
          this.dto.Descripcion;
          this.puedeEditar = false;
  
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
          this.fechaCreacion = new Date();
          this.fechaModificacion = null;
          break;
  
        case ConstanteUI.ACCION_SOLICITADA_EDITAR:
          this.dto = rowdata;
          this.puedeEditar = false;
          this.fechaModificacion = new Date();
          this.fechaCreacion = new Date(this.dto.FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
  
          this.dto.UsuarioModificacion = this.getUsuarioAuth().data[0].NombreCompleto.trim();
          this.dto.FechaModificacion = new Date();
          break;
  
        case ConstanteUI.ACCION_SOLICITADA_VER:
          this.dto = rowdata;
  
          this.puedeEditar = true;
          if (rowdata.FechaModificacion == null || rowdata.FechaModificacion == null) { this.fechaModificacion = null; }
          else { this.fechaModificacion = new Date(rowdata.FechaModificacion); }
          this.fechaCreacion = new Date(rowdata.FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
          break;
      }
  
    }
  

  async coreGuardar() {
      try {
        
        console.log("Probando guardar", this.dto);
        // if (this.estaVacio(this.dto.Descripcion)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'ingrese una descripción válida'); return; }
        // if (this.estaVacio(this.dto.Estado)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione una estado válido'); return; }
        if (this.estaVacio(this.dto.CuentaBancaria)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'ingrese una cuenta bancaria válida'); return; }
        if (this.estaVacio(this.dto.Descripcion)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'ingrese una descripción válida'); return; }
        if (this.estaVacio(this.dto.FechaApertura)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'ingrese una fecha de apertura válida'); return; }
        if (this.estaVacio(this.dto.TipoCuenta)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione una tipo de cuenta válida'); return; }
        if (this.estaVacio(this.dto.CuentaContable)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'ingrese una cuenta contable válida'); return; }
        if (this.estaVacio(this.dto.CuentaBancariaConsolidada)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'ingrese una cuenta bancaria consolidada válida'); return; }
        if (this.estaVacio(this.dto.CuentaBancariaOriginal)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'ingrese una cuenta bancaria original válida'); return; }
        if (this.estaVacio(this.dto.Banco)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione una banco válido'); return; }
        if (this.estaVacio(this.dto.MonedaCodigo)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione una moneda válida'); return; }

        
        let valorAccionServicio: number = this.accionRealizar == ConstanteUI.ACCION_SOLICITADA_NUEVO ? 1 : 2;
        this.bloquearPag = true;
  
        const consultaRepsonse = await this._CuentaBancariaService.mantenimientoCuentaBancaria(valorAccionServicio, this.dto, this.getUsuarioToken());
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


