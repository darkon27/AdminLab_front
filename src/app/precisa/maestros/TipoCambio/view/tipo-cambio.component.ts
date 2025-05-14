import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { MensajeController } from '../../../../../util/MensajeController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { filtroParametros } from '../../Parametros/model/filtro.parametros';
import { IParametro } from '../../Parametros/model/iparametro';
import { Parametros } from '../../Parametros/model/parametros';
import { ParametrosService } from '../../Parametros/service/parametros.service';
import { TipoCambioMantenimientoComponent } from '../components/tipo-cambio-mantenimiento.component';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { forkJoin } from 'rxjs';
import { MaestrotipocambioService } from '../servicio/maestrotipocambio.service';
import { Filtrotipodecambio } from '../dominio/filtro/Filtrotipodecambio';
import { DtoTipocambiomast } from '../dominio/dto/DtoTipocambiomast';


@Component({
  selector: 'ngx-tipo-cambio',
  templateUrl: './tipo-cambio.component.html',
  styleUrls: ['./tipo-cambio.component.scss']
})

export class TipoCambioComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  @ViewChild(TipoCambioMantenimientoComponent, { static: false }) tipoCambioMantenimientoComponent: TipoCambioMantenimientoComponent;

  bloquearPag: boolean;
  btnEliminar?: boolean;
  btnNuevoAccion?: boolean;
  btnGuardar?: boolean;

  filtro: DtoTipocambiomast = new DtoTipocambiomast();
  // Entydad: Parametros = new Parametros();
  // FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  lstEstado: SelectItem[] = [];
  lstCompania: SelectItem[] = [];
  lstTipoCambio: any[] = [];
  lstMoneda: any[] = [];

  constructor(
    private _ExportarService: ExportarService,
    private _MessageService: MessageService,

    private _ParametrosService: ParametrosService,
    private _ConfirmationService: ConfirmationService,

    private _MaestrocompaniaMastService: MaestrocompaniaMastService,
    private _MaestrotipocambioService: MaestrotipocambioService
  ) {
    super();
  }
  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    this.cargarSelect();

  }
  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOTODOS, value: null };
    const filtroCompania: FiltroCompaniamast = new FiltroCompaniamast();;
    filtroCompania.estado = 'A'
    forkJoin({
      estados: this.obtenerDataMaestro('ESTLETRAS'),
      monedas: this._MaestrotipocambioService.listarMonedas({ Estado: 'A' }),
      compania: this._MaestrocompaniaMastService.listarCompaniaMast({ estado: 'A' }),
    }
    ).subscribe(resp => {
      this.lstEstado = [optTodos, ...resp.estados];
      const dataCompania = resp.compania?.map((ele: any) => ({
        label: ele.DescripcionCorta?.trim()?.toUpperCase() || "", value: `${ele.CompaniaCodigo?.trim() || ""}00`, title: ele.Persona
      }));
      this.lstCompania = [optTodos, ...dataCompania];

      const dataMoneda = resp.monedas?.map((ele: any) => ({
        label: ele.DescripcionCorta?.trim()?.toUpperCase().replace('DOLÁRES', 'DÓLARES') || "", value: `${ele.MonedaCodigo?.trim() || ""}`
      }));

      this.lstMoneda = [optTodos, ...dataMoneda];

    });
  }

  coreBuscar(): void {
    this.bloquearPag = true;
    this.filtro.Factor = 1;
    this._MaestrotipocambioService.listarmaestroTipoCambio(this.filtro).then((res) => {
      var contado = 1;
      res?.forEach(element => {
        element.num = contado++;
        element.MonedaDesc = this.lstMoneda.filter((f) => f.value == element.MonedaCodigo)[0]?.label.replace('DOLÁRES', 'DÓLARES');
      });
      this.lstTipoCambio = res?.length > 0 ? res : [];
      this.bloquearPag = false;
    });
  }

  coreNuevo(): void {
    this.tipoCambioMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_NUEVO + 'TIPOCAMBIO', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo, 0, {});
  }
  coreVer(row: any) {
    this.tipoCambioMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_VER + 'TIPOCAMBIO', ''), ConstanteUI.ACCION_SOLICITADA_VER, this.objetoTitulo.menuSeguridad.titulo, 0, row);
  }
  coreEditar(row: any) {
    this.tipoCambioMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_EDITAR + 'TIPOCAMBIO', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, this.objetoTitulo.menuSeguridad.titulo, 0, row)
  }

  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreMensaje(mensage: MensajeController): void {
    const dataDevuelta = mensage.resultado;

    switch (mensage.componente.toUpperCase()) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO + 'TIPOCAMBIO':
      case ConstanteUI.ACCION_SOLICITADA_EDITAR + 'TIPOCAMBIO':
        this.coreBuscar();
        break;
      default:
        break;
    }
  }
  coreExportar(): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }
  coreInactivar(event: any) {
    //console.log("llego coreInvactivar", event);
    this._ConfirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: () => {
        this.bloquearPag = true;
        event.Estado = "I";
        event.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
        this._ParametrosService.mantenimientoParametros(3, event, this.getUsuarioToken()).then(
          res => {
            if (res.success == true) {
              this.MensajeToastComun('notification', 'success', 'Advertencia', res.mensaje);
              this.coreBuscar();
            } else {
              this.MensajeToastComun('notification', 'warn', 'Advertencia', res.mensaje);
            }

          }).catch(error =>
            console.error(error)
          )

        this.bloquearPag = false;
      }
    })
  }

  // coreinactivar(row) {
  //   // this.confirmationService.confirm({
  //   //   header: "Confirmación",
  //   //   icon: "fa fa-question-circle",
  //   //   message: "¿Desea inactivar este registro ? ",
  //   //   key: "confirm2",
  //   //   accept: () => {
  //   //     row.Estado = 'I';
  //   //     row.fechaModificacion = new Date();
  //   //     this.ParametrosService.mantenimientoParametros(2, row, this.getUsuarioToken()).then(
  //   //       res => {
  //   //         //console.log("res", res);
  //   //         if (res != null) {
  //   //           this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Anulado con éxito.' });
  //   //           this.coreBuscar();
  //   //         }
  //   //       });
  //   //   }
  //   // });
  // }


  // coreMensaje(mensage: MensajeController): void {
  //   if (mensage.componente == "SELECTOR_PARAMETROS") {
  //     this.coreBuscar();
  //   }

  // }




  // exportExcel() {
  //   if (this.lstparametros == null || this.lstparametros == undefined || this.lstparametros.length == 0) {
  //     this.messageService.add({
  //       key: "bc",
  //       severity: "warn",
  //       summary: "Warning",
  //       detail: "Realice Busqueda primero",
  //     });
  //   } else {
  //     let listaExportar: IParametro[] = [];
  //     let contador: number = 0;
  //     let fechaCreacion: string;
  //     let fechaP: string;
  //     this.lstparametros.forEach(function (e: Parametros) {
  //       contador += 1;

  //       if (e.FechaCreacion != null || e.FechaCreacion != undefined) {
  //         let fechaInicio = new Date(e.FechaCreacion);
  //         let dd = ("0" + fechaInicio.getDate()).slice(-2);
  //         let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
  //         let yyyy = fechaInicio.getFullYear()
  //         fechaCreacion = dd + "/" + mm + "/" + yyyy;
  //       } else {
  //         fechaCreacion = ''
  //       }

  //       if (e.Fecha != null || e.Fecha != undefined) {
  //         let fechaI = new Date(e.Fecha);
  //         let dd = ("0" + fechaI.getDate()).slice(-2);
  //         let mm = ("0" + (fechaI.getMonth() + 1)).slice(-2);
  //         let yyyy = fechaI.getFullYear()
  //         fechaP = dd + "/" + mm + "/" + yyyy;
  //       } else {
  //         fechaP = ''
  //       }

  //       let itemExportar: IParametro = {
  //         NRO: contador,
  //         // FECHA: fechaCreacion,
  //         COMPAÑIA: e.DescripcionCorta,
  //         TIPO_DATO: e.TipodeDatoFlag?.toUpperCase() || '',
  //         APLICACION: e.AplicacionCodigo?.toUpperCase() || '',
  //         TEXTO: e.Texto?.toUpperCase() || '',
  //         PARAMETRO: e.ParametroClave?.toUpperCase() || '',
  //         VALOR: new Intl.NumberFormat().format(e.Numero),
  //         FECHAP: fechaP,
  //         ESTADO: e.ESTADOdesc?.toUpperCase() || '',
  //         DESCRIPCION: e.DescripcionParametro?.toUpperCase() || ''
  //         // EXPLICACION: e.Explicacion?.toUpperCase() || ''
  //       };
  //       // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
  //       listaExportar.push(itemExportar);
  //     });
  //     this.exportarService.exportExcel(this.lstparametros, listaExportar, "Parametros");
  //     this.messageService.add({
  //       key: "bc",
  //       severity: "success",
  //       summary: "Success",
  //       detail: "Archivo EXCEL Generado.",
  //     });
  //   }
  // }

  // //pdf

  // exportPdf() {
  //   if (this.lstparametros == null || this.lstparametros == undefined || this.lstparametros.length == 0) {
  //     this.messageService.add({
  //       key: "bc",
  //       severity: "warn",
  //       summary: "Warning",
  //       detail: "Realice Busqueda primero",
  //     });
  //   } else {

  //     var col = [[
  //       "NRO",
  //       "FECHA",
  //       "COMPAÑIA",
  //       "CODIGO",
  //       "PARAMETRO",
  //       "ESTADO",
  //       "DESCRIPCION",
  //     ]];
  //     var rows = [];
  //     let contador: number = 0;
  //     let fechaCreacion: string;
  //     this.lstparametros.forEach(function (e: Parametros) {
  //       contador += 1;

  //       if (e.FechaCreacion != null || e.FechaCreacion != undefined) {
  //         let fechaInicio = new Date(e.FechaCreacion);
  //         let dd = ("0" + fechaInicio.getDate()).slice(-2);
  //         let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
  //         let yyyy = fechaInicio.getFullYear()
  //         fechaCreacion = dd + "/" + mm + "/" + yyyy;
  //       } else {
  //         fechaCreacion = ''
  //       }

  //       let itemExportar = [
  //         contador,
  //         fechaCreacion,
  //         e.DescripcionCorta,
  //         e.AplicacionCodigo.toUpperCase() || '',
  //         e.ParametroClave?.toUpperCase() || '',
  //         e.ESTADOdesc?.toUpperCase() || '',
  //         e.DescripcionParametro?.toUpperCase() || '',

  //       ];
  //       rows.push(itemExportar);
  //     });

  //     this.exportarService.ExportPdf(this.lstparametros, col, rows, "Parametros.pdf", "l");
  //     this.messageService.add({
  //       key: "bc",
  //       severity: "success",
  //       summary: "Success",
  //       detail: "Archivo PDF Generado.",
  //     });
  //   }

  // }


  // cargarEstados() {
  //   this.lstEstado = [];
  //   this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
  //   this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
  //     this.lstEstado.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
  //   });
  //   //console.log("llego cargarEstados", this.lstEstado);
  //   this.filtro.Estado = "A";
  // }
  // cargarCombocompania(): Promise<number> {
  //   this.FiltroCompan.estado = "A";
  //   this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
  //   return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
  //     //console.log("listarCompaniaMast", res);
  //     res.forEach(ele => {
  //       //  this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
  //       this.lstCompania.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
  //     });
  //     return 1;
  //   });
  // }

  // /*    MENSAJES DE CONFIRMACIÓN    */
  // makeToast(title: string) {
  //   // this.toastrService.show(null, `${title}`, this.showToast(this.status))
  // }

  // coreGuardar(): void {
  //   throw new Error('Method not implemented.');
  // }
  // coreExportar(): void {
  //   throw new Error('Method not implemented.');
  // }
  // coreSalir(): void {
  //   throw new Error('Method not implemented.');
  // }

  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this._MessageService.clear();
    this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }

}
