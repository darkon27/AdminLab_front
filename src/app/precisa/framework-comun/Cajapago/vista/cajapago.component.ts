import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormGroup } from '@angular/forms';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UISelectorController } from '../../../../../util/UISelectorController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { PersonaService } from '../../Persona/servicio/persona.service';
import { Router } from '@angular/router';
import { LoginService } from '../../../auth/service/login.service';
import { DtoPacienteClinica } from '../../../admision/paciente-clinica/dominio/dto/DtoPacienteClinica';
import { MaestrodetalleService } from '../../../maestros/Detalle/servicio/maestrodetalle.service';
import { dtoComprobante } from '../../../liquidacion/facturacion/model/dtoComprobante';
import { dtoComprobanteDetalle } from '../../../liquidacion/facturacion/model/dtoComprobanteDetalle';
import { ComprobanteService } from '../../../liquidacion/facturacion/service/Comprobante.services';
import Swal from 'sweetalert2';
import { dtoCobranzadetalle } from '../../../caja/cobranzas/model/dtoCobranzadetalle';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { dtoCobranza } from '../../../caja/cobranzas/model/dtoCobranza';
import { ModalCobranza } from '../../../caja/cobranzas/model/ModalCobranza';
@Component({
  selector: 'ngx-cajapago',
  templateUrl: './cajapago.component.html',
  styleUrls: ['./cajapago.component.scss']
})
export class CajaPagoComponent extends ComponenteBasePrincipal implements OnInit, UISelectorController {

  bloquearPag: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  Auth = this.getUsuarioAuth().data;
  lstListarXAdmision: DtoPacienteClinica[] = [];
  admision: DtoPacienteClinica;
  filtroComp: dtoComprobante = new dtoComprobante();
  dtodetComp: dtoComprobanteDetalle = new dtoComprobanteDetalle();

  filtro: dtoCobranza = new dtoCobranza();
  dtodet: dtoCobranzadetalle = new dtoCobranzadetalle();
  dto: ModalCobranza = new ModalCobranza();
  lstDetalle: dtoCobranzadetalle[] = [];
  clonedProducts: dtoCobranzadetalle[] = [];

  verCajapago: boolean = false;
  verLabelId: boolean = false;
  ocultarLabelId: boolean = false;
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string;
  editarCampos: boolean = false;
  validarMed: FormGroup
  MontoPago: any;
  cantidadSoles: any;
  valorSoles: any;
  totalEfectivo: any;
  vueltoEfectivo: any;


  //detalle 
  // [{code:'E',name: 'EFECTIVO'}, {code: 'TC', name: 'TARJETA DE CREDITO / DEBITO'}, {code: 'TF', name: 'TRANSFERENCIA'}]
  isDialogDetalle: boolean;
  accionDetalle: string = '';
  lstTipoPago: SelectItem[] = [];
  lstMoneda: SelectItem[] = [];
  lstBanco: SelectItem[] = [];
  lstMonedadet: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];
  lstTipoVenta: SelectItem[] = [];
  lstMedioPago: SelectItem[] = [];
  lstSerie: SelectItem[] = [];


  //
  verTipoPago: string;
  tipoPagoSeleccionado: string = 'EFECTIVO';

  constructor(
    private personaService: PersonaService,
    public loginService: LoginService,
    private ComprobanteService: ComprobanteService,
    private MaestrodetalleService: MaestrodetalleService,
    private messageService: MessageService,
    private router: Router,
    private toastrService: NbToastrService,
  ) { super(); }



  ngOnInit(): void {
    this.titulo = '';
    const p6 = this.listaComboTipoComprobante();
    Promise.all([p6]).then(
      f => {
        this.fechaActual();
      });
  }

  fechaActual() {
    var hoy = new Date();
    var dia = hoy.getDate() + 1;
    var mes = hoy.getMonth();
    var anio = hoy.getFullYear();
    this.filtro.FechaVencimiento = new Date(`${anio},${mes},${dia}`);
    this.filtro.FechaEmision = new Date(hoy);
    //console.log("fechaActual FechaVencimiento", this.filtro.FechaVencimiento);

  }

  saveData() {  //prueba validar med del value esto si se puede borar
    //console.log("save data", this.validarMed.value);
  }

  coreBusquedaRapida(filtro: string): void {
    throw new Error('Method not implemented.');
  }

  coreBuscar(tabla: Table): void {
    throw new Error('Method not implemented.');
  }

  coreFiltro(flag: boolean): void {
    throw new Error('Method not implemented.');
  }

  coreSalir(): void {
    //  this.mensajeController.componenteDestino.desbloquearPagina();        
    this.verCajapago = false;
  }


  coreAgregar() {
    var linea = 0;
    this.lstDetalle.forEach(e => {
      linea++;
    });

    if (linea == 0) {
      linea = 1;
    }

    var objdet = new dtoCobranzadetalle();
    objdet.Secuencial = linea;
    objdet.Estado = 1;
    objdet.FormaPago = 0;
    objdet.Moneda = "";
    objdet.Banco = "";
    objdet.NumeroTarjeta = "";
    objdet.Monto = 0;
    objdet.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
    objdet.FechaCreacion = new Date();
    this.lstDetalle.push(objdet);
    this.lstDetalle = [...this.lstDetalle];
    //console.log("Cobranza Registro Filtro", this.lstDetalle);
  }

  validarTeclaEnter(evento) {
    if (evento.key == "Enter" || evento.key == "Tab") {
      this.valorSoles = this.cantidadSoles;
      this.totalEfectivo = this.valorSoles;
      this.vueltoEfectivo = this.totalEfectivo - this.MontoPago;


    }
  }

  enterCantidad(evento) {
    if (evento.key == "Enter" || evento.key == "Tab") {
      var cantidadExamenes = 0
      var total = 0
      this.lstDetalle.forEach(e => {
        if (e.Monto <= 0 || this.esNumeroVacio(e.Monto)) {
          //  e.Monto = 1;
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: 'Cantidad ingresada no valida',
            confirmButtonColor: '#094d74',
            confirmButtonText: 'OK'
          })
        }
        /*         var ExamenConIgv = e.Valor * this.getUsuarioAuth().data[0].Igv;
                cantidadExamenes += e.Cantidad;
                e.ValorEmpresa = e.Cantidad * (e.Valor + ExamenConIgv);
                total += e.ValorEmpresa; */
      });

    }
  }

  OnBlurMethod() {
    var cantidadExamenes = 0
    var total = 0
    this.lstDetalle.forEach(e => {
      if (e.Monto <= 0 || this.esNumeroVacio(e.Monto)) {

        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: 'Cantidad ingresada no valida',
          confirmButtonColor: '#094d74',
          confirmButtonText: 'OK'
        })
      }
      /*       cantidadExamenes += e.Cantidad;
            e.ValorEmpresa = e.Cantidad * e.Valor;
            total += e.ValorEmpresa; */
    });
  }

  esCantidad(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
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

  onRowEditInit(product: dtoCobranzadetalle) {
    //console.log("Cobranza Reg onRowEditInit :: ", product);
    this.clonedProducts[product.LoteTarjeta as string] = { ...product };
  }

  onRowEditSave(product: dtoCobranzadetalle) {
    //console.log("Cobranza Reg onRowEditSave Inicio:: ", product);
    var listaComboPago = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('SessionTipoPago')));
    var listaComboMoneda = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('SessionMoneda')));
    var listaComboBanco = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('SessionBanco')));
    //console.log("Reg onRowEditSave listaComboPago:: ", listaComboPago);
    //console.log("Reg onRowEditSave listaComboMoneda:: ", listaComboMoneda);
    //console.log("Reg onRowEditSave listaComboBanco:: ", listaComboBanco);

    for (let element of listaComboPago) {
      if (element.hasOwnProperty("Nombre")) {
        if (element.Nombre == product.FormaPagoDES) {
          product.FormaPago = element.IdCodigo;
        }
      }
    }

    for (let element of listaComboMoneda) {
      if (element.hasOwnProperty("DescripcionCorta")) {
        if (element.DescripcionCorta == product.MonedaDes) {
          product.Moneda = element.MonedaCodigo;
        }
      }
    }

    for (let element of listaComboBanco) {
      if (element.hasOwnProperty("DescripcionCorta")) {
        if (element.DescripcionCorta == product.BancoDes) {
          product.Banco = element.Banco;
        }
      }
    }

    //console.log("Cobranza Reg onRowEditSave Asignado:: ", product);


    if (product.Monto > 0) {

      /*     product.Monto
              numExamen += 1;
              examen.numeroXadmision = null; // si son nuevo, resultan estar en undefined
              examen.numeroXadmision = numExamen;
              var ExamenConIgv = examen.Valor * this.getUsuarioAuth().data[0].Igv;
              totalIgv += ExamenConIgv;
              this.lastYearTotal += examen.Valor;
              this.redondeoTotal += examen.ValorEmpresa;
              soloTotal += examen.ValorEmpresa;
              this.cantidad += examen.Cantidad; */





      delete this.clonedProducts[product.LoteTarjeta as string];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'El Producto se ha Modificado ' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en el Precio' });
    }
  }

  onRowEditCancel(product: dtoCobranzadetalle, index: number) {
    this.lstDetalle[index] = this.clonedProducts[product.LoteTarjeta as string];
    delete this.clonedProducts[product.LoteTarjeta as string];
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  coreSeleccionar(dto: any): void {
    this.mensajeController.resultado = dto;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    this.coreSalir();
  }

  coreIniciarComponente(mensaje: MensajeController, rowdata?: any): void {
    this.bloquearPag = true;
    this.verCajapago = true;
    this.titulo = 'PAGO PARTICULAR';
    this.mensajeController = mensaje;
    this.acciones = `${this.titulo}: ${this.mensajeController.tipo}`;
    //console.log("cajapago coreIniciarComponente mensajeController", this.mensajeController);
    const p3 = this.ListarMoneda();
    const p1 = this.listaComboTipoVenta();
    const p2 = this.listaComboMedioPago();
    const p4 = this.ListarTipoPago();
    const p5 = this.ListarBanco();

    Promise.all([p1, p2, p3, p4, p5]).then(
      f => {
        this.fechaActual();
        this.admision = this.mensajeController.componenteDestino.admision;
        this.filtro = this.mensajeController.componenteDestino.filtro;
        this.filtro.MontoAfecto = this.mensajeController.componenteDestino.filtro.Afecto;
        this.filtro.IGV = this.mensajeController.componenteDestino.filtro.Igv;
        this.filtro.MontoTotal = this.mensajeController.componenteDestino.filtro.Total;
        this.MontoPago = this.filtro.MontoTotal;
        this.filtro.DocumentoCliente = this.admision.Documento;
        this.filtro.FechaAdmision = new Date(this.admision.FechaAdmision);
        this.filtro.NombreCliente = this.admision.NombreCompleto;

        //console.log("cajapago coreIniciarComponente rowdata", rowdata);
        this.lstListarXAdmision = this.mensajeController.componenteDestino.lstListarXAdmision;
        //console.log("cajapago coreIniciarComponente filtro", this.filtro);

        this.filtro.Compania = this.Auth[0].ACCESO;
        this.filtro.ClasificadorMovimiento = this.admision.ClasificadorMovimiento;
        this.filtro.IdSede = this.admision.IdSede;
        this.filtro.TipoComprobante = "BV";
        this.filtro.Moneda = "LO";
        this.filtro.TipoMedioPago = 1;
        this.ListarSucursalSerie();
        this.filtro.SerieComprobante = this.Auth[0].SerieBV;
        this.bloquearPag = false;
      });


  }


  listaComboTipoComprobante() {
    this.lstTipoComprobante = [];
    this.lstTipoComprobante.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipoComprobante.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    //console.log("Facturacion cargarComboTipoComprobante", this.lstTipoComprobante);
  }

  listaComboTipoVenta() {
    this.lstTipoVenta = [];
    this.lstTipoVenta.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIPVEN").forEach(i => {
      this.lstTipoVenta.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    //console.log("Facturacion listaComboTipoVenta", this.lstTipoVenta);
  }

  listaComboMedioPago() {
    this.lstMedioPago = [];
    this.lstMedioPago.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "MEDPAG").forEach(i => {
      this.lstMedioPago.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    //console.log("Facturacion listaComboMedioPago", this.lstMedioPago);
  }

  ListarMoneda() {
    let dto = {  Estado: "A"  }
    this.lstMoneda = [];
    this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.MaestrodetalleService.ListarMoneda(dto).then(res => {
    //console.log("cargarComboMoneda::", res);
        res.forEach(ele => {
            this.lstMoneda.push({ label: ele.DescripcionCorta.trim(), value: ele.MonedaCodigo });
        });
    });
  }

  ListarSucursalSerie(): Promise<number> {
    this.lstSerie = [];
    let filtroSerie = {
      Estado: "A",
      ClasificadorMovimiento: this.filtro.ClasificadorMovimiento,
      CompaniaCodigo: this.filtro.Compania,
      IdSede: this.filtro.IdSede,
      TipoComprobante: this.filtro.TipoComprobante
    };
    //console.log("Facturacion Filtro", filtroSerie);
    this.lstSerie.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.ComprobanteService.ListarSedeSucursalNegocio(filtroSerie).then(resp => {
      resp.forEach(e => {
        this.lstSerie.push({ label: e.SERIE, value: e.SERIE.trim() });
      });
      //console.log("Facturacion ListarSucursalSerie", resp);
      return 1;
    });
  }

  selectedItemTipoComprobante(event) {
    //console.log("Facturacion selectedItemTipoComprobante", event);
    if (this.filtro.TipoComprobante == null) {
      this.lstSerie.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    } else {
      this.filtro.TipoComprobante = event.value;
      this.ListarSucursalSerie();
    }
  }


  ListarBanco() {
    this.lstBanco = [];
    let filtroBanco = { Estado: "A" };
    //console.log("Cobranza Registro Filtro", filtroBanco);
    this.lstBanco.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.ComprobanteService.ListarBanco(filtroBanco).then(resp => {
      resp.forEach(e => {
        this.lstBanco.push({ label: e.DescripcionCorta, value: e.DescripcionCorta.trim() });
      });
      sessionStorage.setItem('SessionBanco', JSON.stringify(resp));
      //console.log("Cobranza Registro ListarBanco", resp);
      return 1;
    });
  }

  ListarTipoPago(): Promise<number> {
    this.lstTipoPago = [];
    let filtroPeriodo = { UneuNegocioId: 1 };
    this.lstTipoPago.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.ComprobanteService.ListarTipoPago(filtroPeriodo)
      .then((res) => {
        //console.log("Cobranza Registro ListarTipoPago", res);
        res.forEach((ele) => {
          this.lstTipoPago.push({ label: ele.Nombre.trim(), value: ele.Nombre.trim() });
        });
        sessionStorage.setItem('SessionTipoPago', JSON.stringify(res));
        return 1;
      });
  }


  keydownMonto(evento): void {
    //console.log("Cobranza Reg keydownMonto :: ", evento);
    if (evento.key == "Enter" || evento.key == "Tab") {
      this.bloquearPag = true;
      var subtotal = 0
      this.lstDetalle.forEach(e => {
        if (e.Monto <= 0 || this.esNumeroVacio(e.Monto)) {
          this.bloquearPag = false;
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: 'Monto ingresada no valida',
            confirmButtonColor: '#094d74',
            confirmButtonText: 'OK'
          })
        }
        subtotal += e.Monto;
      });

      //  this.filtro.CalTotal = subtotal;
      ////console.log("Cobranza Reg keydownMonto evento ::", evento.value);    
      //console.log("Cobranza Reg keydownMonto lstDetalle::", this.lstDetalle);
      this.bloquearPag = false;
    }
  }

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }

  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }

  coreMensaje(mensage: MensajeController): void {

  }


  coreAccion(accion: string): void {
    throw new Error('Method not implemented.');
  }

  saveProduct() {

  }

  nuevoDetalle(accion: string) {
    this.accionDetalle = accion;
    this.isDialogDetalle = true;
  }


  async btnCerrarDetalle() {
    /*     this.detalleSeleccionado = new DtoEgresoDetalle();
        let filtroegresoDetalle: DtoEgresoDetalle = new DtoEgresoDetalle();
        filtroegresoDetalle.IdEgreso = this.egreso.IdEgreso;    */

  }

  async ingresarDetalle() {

  }
  mostrarMensaje(mensaje: string, tipo: string): void {
    this.messageService.clear();
    this.messageService.add({ severity: tipo, summary: 'Mensaje', detail: mensaje });
  }

  elegirTipoPago(event) {

    this.tipoPagoSeleccionado = event.value;

    // //console.log("tipo sleeccionado", tipoPagoSeleccionado);
    // for (let tipoPago of this.lstTipoPago) {
    //   switch (tipoPago.value) {
    //     case tipoPagoSeleccionado:

    //       break;
    //   }
    // }


  }
}
