import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { dtoCobranza } from "../model/dtoCobranza";
import { dtoCobranzadetalle } from "../model/dtoCobranzadetalle";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { LoginService } from "../../../auth/service/login.service";
import { ComprobanteService } from "../../../liquidacion/facturacion/service/Comprobante.services";
import { MaestrodetalleService } from "../../../maestros/Detalle/servicio/maestrodetalle.service";
import { NbToastrService } from "@nebular/theme";
import { PersonaService } from "../../../framework-comun/Persona/servicio/persona.service";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { UISelectorController } from "../../../../../util/UISelectorController";
import { MensajeController } from "../../../../../util/MensajeController";
import { filtroComprobante } from "../../../liquidacion/facturacion/model/filtro.Comprobante";
import Swal from "sweetalert2";
import { ModalCobranza } from "../model/ModalCobranza";
import { CobranzaService } from "../service/cobranza.service";
import { convertDateStringsToDates } from "../../../framework/funciones/dateutils";
import { FiltroCobranza } from "../model/filtro.Cobranza";

@Component({
    selector: 'ngx-cobranzas-mantenimiento',
    templateUrl: './cobranzas-mantenimiento.component.html',
    styles: [`
        :host ::ng-deep .p-cell-editing {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
    `]
  })

export class CobranzasMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, UISelectorController {
  bloquearPag: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  Auth = this.getUsuarioAuth().data;
  filtro: dtoCobranza = new dtoCobranza();
  dtodet: dtoCobranzadetalle = new dtoCobranzadetalle();
  dto: ModalCobranza = new ModalCobranza();

  verCajapago: boolean = false;
  verLabelId: boolean = false;
  ocultarLabelId: boolean = false;
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string;
  editarCampos: boolean = false;
  MontoPago: any;
  cantidadSoles: any;
  valorSoles: any;
  totalEfectivo: any;
  vueltoEfectivo: any;

  filtroComp : filtroComprobante = new filtroComprobante();
  lstComprobante: any[] = [];

  lstDetalle: dtoCobranzadetalle[] = [];
  clonedProducts: dtoCobranzadetalle[] = [];
  filtroCobran: FiltroCobranza = new FiltroCobranza();
//detalle 
  isDialogDetalle: boolean;
  accionDetalle: string = '';
  lstTipoPago: SelectItem[] = [];
  lstMoneda: SelectItem[] = [];
  lstMonedadet: SelectItem[] = [];
  lstBanco: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];
  lstTipoVenta: SelectItem[] = [];
  lstMedioPago: SelectItem[] = [];
  lstSerie: SelectItem[] = [];

  constructor(
    private messageService: MessageService,
    private toastrService: NbToastrService,
    public loginService: LoginService,
    private ComprobanteService: ComprobanteService,
    private MaestrodetalleService: MaestrodetalleService,    
    private CobranzaService: CobranzaService,
  ) { super(); }


  coreBusquedaRapida(filtro: string): void {
    throw new Error('Method not implemented.');
  }

  
  coreFiltro(flag: boolean): void {
    throw new Error('Method not implemented.');
  }

  coreSalir(): void {
    //  this.mensajeController.componenteDestino.desbloquearPagina();        
    this.verCajapago = false;
  }

  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }

  coreMensaje(mensage: MensajeController): void {

  }

  coreAccion(accion: string): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.titulo = '';
    const p2 = this.listaComboTipoComprobante();
    const p3 = this.ListarMoneda();
   // const p1 = this.listaComboTipoVenta();
    const p4 = this.ListarTipoPago();
    const p5 = this.ListarBanco();
    Promise.all([p2, p3,p4,p5]).then(
      f => {
        this.fechaActual();  
        this.lstDetalle   = new Array();
      });
  }


  fechaActual() {
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() - 1;
    var anio = hoy.getFullYear();
    this.filtro.FechaPago = new Date(`${anio},${mes},${dia}`);
    this.filtro.FechaIngreso = new Date(hoy);
    //console.log("Cobranza registro fecha", this.filtro.FechaPago);
  }


  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false;    
}

  coreSeleccionar(dto: any): void {
    this.mensajeController.resultado = dto;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    this.coreSalir();
  }

  coreIniciarComponente(mensaje: MensajeController,rowdata?: any): void {
    this.filtro = new dtoCobranza();
    this.lstDetalle   = new Array();
    this.clonedProducts  = new Array();
    this.filtroCobran  = new FiltroCobranza();
    this.dtodet  = new dtoCobranzadetalle();
    this.dto  = new ModalCobranza();

    this.mensajeController = mensaje;
    //console.log("Cobranza registro coreIniciarComponente mensajeController", this.mensajeController);
    this.verCajapago = true;
    if(this.mensajeController.componente=="NUEVO"){
      this.titulo = '';
      this.acciones = `Registro: Cobranza NUEVO`;
      this.lstDetalle   = new Array();
      this.fechaActual();
      this.filtro.TipoComprobante="BV";
      this.filtro.Compania="00000000";
      this.ListarSucursalSerie();

    }
    else{
      this.titulo = '';
      this.acciones = `Registro: Cobranza ` + this.mensajeController.componente;
      this.lstDetalle   = new Array();
      //console.log("Cobranza registro coreIniciarComponente rowdata", rowdata);
      this.filtro=rowdata;
      this.filtro.FechaEmision = new Date(rowdata.FechaEmision);
      this.filtro.FechaVencimiento = new Date(rowdata.FechaVencimiento);
      this.ListarSucursalSerie();
      this.filtro.SerieComprobante = rowdata.SerieComprobante;    
      this.coreListarDetalle();
    }
  }
  

  coreListarDetalle(): void {
    this.bloquearPag = true;
    //console.log("Cobranza coreListarDetalle:", this.filtro); 
    this.filtroCobran.IdCobranza=  this.filtro.IdCobranza;
    this.CobranzaService.ListarCobranzaDetalle(this.filtroCobran).then((res) => {
      this.bloquearPag = false;
      var contado = res.length;
      res.forEach((element) => {
        element.num = contado--;
      });
      this.lstDetalle = res;
      //console.log("Cobranza coreListarDetalle :", res);
    });
  }


  listaComboTipoComprobante() {
    this.lstTipoComprobante = [];
    this.lstTipoComprobante.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipoComprobante.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    //console.log("Cobranza Registro cargarComboTipoComprobante", this.lstTipoComprobante);
  }

  selectedItemTipoComprobante(event){
    //console.log("Cobranza selectedItemTipoComprobante", event);
    if (this.filtro.TipoComprobante == null){
      this.lstSerie.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    }else{
      this.filtro.TipoComprobante = event;
      this.ListarSucursalSerie();
    }
  }


  ListarSucursalSerie(): Promise<number> {
    this.lstSerie = [];
    let filtroSerie = { 
          Estado:  "A", 
          ClasificadorMovimiento: this.filtro.ClasificadorMovimiento,
          CompaniaCodigo: this.filtro.Compania,
          Sucursal: this.filtro.Sucursal,
          TipoComprobante: this.filtro.TipoComprobante
      };
    this.lstSerie.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.ComprobanteService.ListarSucursalCompSerie(filtroSerie).then(resp => {
      resp.forEach(e => {
        this.lstSerie.push({ label: e.Serie, value: e.Serie});
      });
      //console.log("Cobranza reg ListarSucursalSerie", resp);
      return 1;
    });
  }


  ListarBanco() {
    this.lstBanco = [];
    let filtroBanco = {       Estado:  "A"      };
    //console.log("Cobranza Registro Filtro", filtroBanco);
    this.lstBanco.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.ComprobanteService.ListarBanco(filtroBanco).then(resp => {
      resp.forEach(e => {
        this.lstBanco.push({ label: e.DescripcionCorta, value: e.DescripcionCorta.trim()});
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


  listaComboTipoVenta() {
    this.lstTipoVenta = [];
    this.lstTipoVenta.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIPVEN").forEach(i => {
        this.lstTipoVenta.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    //console.log("Cobranza Registro listaComboTipoVenta", this.lstTipoVenta);
  }

  listaComboMedioPago() {
    this.lstMedioPago = [];
    this.lstMedioPago.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "MEDPAG").forEach(i => {
      this.lstMedioPago.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    //console.log("Cobranza Registro listaComboMedioPago", this.lstMedioPago);
  }

  ListarMoneda(): Promise<number> {
    this.lstMoneda = [];
    let filtroMoneda = { Estado:  "A" };
    this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.MaestrodetalleService.ListarMoneda(filtroMoneda).then(resp => {
      resp.forEach(e => {
        this.lstMoneda.push({ label: e.DescripcionCorta, value: e.MonedaCodigo });
        this.lstMonedadet.push({ label: e.DescripcionCorta, value: e.DescripcionCorta });        
      });
      sessionStorage.setItem('SessionMoneda', JSON.stringify(resp));   
      //console.log("Cobranza Registro filtroMoneda", resp);
      return 1;
    });
  }


  keydownBuscar(evento): void {    
    if (evento.key == "Enter" || evento.key == "Tab") {
        if (this.filtro.Numero.length <= 0) {
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: 'Numero Comprobante ingresada no valida',
            confirmButtonColor: '#094d74',
            confirmButtonText: 'OK'
          })
        }
        this.bloquearPag = true;
        this.filtroComp.Compania = this.filtro.Compania;
        this.filtroComp.TipoComprobante = this.filtro.TipoComprobante;
        this.filtroComp.SerieComprobante = this.filtro.SerieComprobante;
        this.filtroComp.NumeroComprobante = this.filtro.Numero;    
        this.filtroComp.Estado = 3;
        //console.log("Cobranza coreBuscar:", this.filtroComp);
        this.ComprobanteService.ListarComprobante(this.filtroComp).then((res) => {
          this.bloquearPag = false;
          res.forEach((element) => {
              this.filtro = element;
              if (this.esFechaVacia(element.FechaEmision)) {
                let FechaEmision = new Date(element.FechaEmision);
                this.filtro.FechaEmision = FechaEmision;
              }
              if (this.esFechaVacia(element.FechaVencimiento)) {
                let FechaVencimiento = new Date(element.FechaVencimiento);
                this.filtro.FechaVencimiento = FechaVencimiento;  
              }
          });
          this.lstComprobante = res;  
          //console.log("Cobranza reg coreBuscar:", this.filtro);
        });
      }
  }

  coreBuscar(): void {
    this.bloquearPag = true;
    this.filtroComp.Compania = this.filtro.Compania;
    this.filtroComp.TipoComprobante = this.filtro.TipoComprobante;
    this.filtroComp.SerieComprobante = this.filtro.SerieComprobante;
    this.filtroComp.NumeroComprobante = this.filtro.Numero;    
    this.filtroComp.Estado = 3;
    //console.log("Cobranza coreBuscar:", this.filtroComp);
     this.ComprobanteService.ListarComprobante(this.filtroComp).then((res) => {
        this.bloquearPag = false;
        res.forEach((element) => {
          this.filtro=element;
          if (this.esFechaVacia(element.FechaEmision)) {
            let FechaEmision = new Date(element.FechaEmision);
            this.filtro.FechaEmision = FechaEmision;
          }
          if (this.esFechaVacia(element.FechaVencimiento)) {
            let FechaVencimiento = new Date(element.FechaVencimiento);
            this.filtro.FechaVencimiento = FechaVencimiento;  
          }
        
        });
      this.lstComprobante = res;
      //console.log("Cobranza reg coreBuscar:", this.filtro);
   
    });
  }


  coreAgregar() {
    var linea =0;
    this.lstDetalle.forEach(e => {
      linea++;
    });

    if(linea == 0){
      linea=1;
    }

    var objdet = new dtoCobranzadetalle();
    objdet.Secuencial = linea;
    objdet.IdComprobante = this.filtro.IdComprobante;
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


  coreEditar(rowData: dtoCobranzadetalle) {
    this.clonedProducts[rowData.Secuencial] = {...rowData};
    //console.log("Cobranza Registro coreEditar rowData", this.clonedProducts);
    //console.log("Cobranza Registro coreEditar lstBanco", this.lstBanco);
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
          if(element.Nombre == product.FormaPagoDES){
            product.FormaPago = element.IdCodigo;
          }   
      }
  } 

  for (let element of listaComboMoneda) {
    if (element.hasOwnProperty("DescripcionCorta")) {
        if(element.DescripcionCorta == product.MonedaDes){
          product.Moneda = element.MonedaCodigo;
        }   
    }
  } 

  for (let element of listaComboBanco) {
    if (element.hasOwnProperty("DescripcionCorta")) {
        if(element.DescripcionCorta == product.BancoDes){
          product.Banco = element.Banco;
        }   
    }
  } 



    //console.log("Cobranza Reg onRowEditSave Asignado:: ", product);
    if (product.Monto > 0) {
        delete this.clonedProducts[product.LoteTarjeta as string];
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    }
}

onRowEditCancel(product: dtoCobranzadetalle, index: number) {
  this.lstDetalle[index] = this.clonedProducts[product.LoteTarjeta as string];
  delete this.clonedProducts[product.LoteTarjeta as string];
}


  keydownMonto(evento): void {  
  
    if (evento.key == "Enter" || evento.key == "Tab") {
      //console.log("Cobranza Reg keydownMonto :: ", evento);
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

        this.filtro.CalTotal = subtotal;
        ////console.log("Cobranza Reg keydownMonto evento ::", evento.value);    
        //console.log("Cobranza Reg keydownMonto lstDetalle::", this.lstDetalle);  
        this.bloquearPag = false;
      }
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  coreGuardar(): void {
    this.bloquearPag = true;
   // //console.log("Cobranza Reg coreGuardar filtro::", this.filtro);  
   // //console.log("Cobranza Reg coreGuardar lstDetalle::", this.lstDetalle);  

    this.dto.cabecera = this.filtro;
    this.dto.cabecera.Monto =  this.filtro.MontoTotal;
    this.dto.cabecera.IdCliente =  this.filtro.IdClienteFacturacion;
    this.dto.cabecera.Cajero = this.getUsuarioAuth().data[0].Usuario;
    this.dto.cabecera.SerieCobranza =  "001";
    this.dto.cabecera.FechaIngreso = new Date(this.filtro.FechaEmision);
    this.dto.cabecera.FechaPago = new Date(this.filtro.FechaVencimiento);
    this.dto.detalle =  this.lstDetalle;

    
    if (this.esNumeroVacio(this.filtro.CalTotal))
    {
      this.messageShow('warn', 'Advertencia', "Debe agregar un monto");
      this.bloquearPag = false;
      return;
    }

    if (this.filtro.CalTotal != this.filtro.MontoTotal)
    {
      this.messageShow('warn', 'Advertencia', "Los montos no coinciden");
      this.bloquearPag = false;
      return;
    }

    //console.log("Cobranza Reg coreGuardar ::", this.dto);

    Swal.fire({
      icon: 'warning',
      title: '¡Mensaje!',
      text: 'Registro sin correo. ¿Desea continuar?',
      showCancelButton: true,
      confirmButtonColor: '#094d74',
      cancelButtonColor: '#ffc72f',
      cancelButtonText: 'No, volver al registro',
      confirmButtonText: 'Sí, guardar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dto.cabecera.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
        this.dto.cabecera.FechaCreacion = new Date();
        this.messageShow('success', 'Success', this.getMensajeGuardado());
        //console.log("Cobranza Reg coreGuardar ::", this.dto);
        this.ServicioRegistrar();

      } else {
        this.verCajapago = true;
      }
    })
    this.bloquearPag = false;  

  }

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }
  
  ServicioRegistrar() {

    this.CobranzaService.MantenimientoCobranza(1, this.dto, this.getUsuarioToken()).then(
      res => {
        //console.log("res guardado:", res);
        if (res.success) {
          this.makeToast(this.getMensajeGrabado(this.dto.cabecera.NumeroCobranza));
          this.verCajapago = false;
          //console.log("entro:",this.mensajeController.resultado)
          this.mensajeController.resultado = res;
          //console.log("res enviando:", res);
          this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        }
        else {
          this.verCajapago = false;
          var mensajito;
          var confirmar;
          var cerrar;
          var validar = 0
          if (this.estaVacio(res.mensaje)) {
            mensajito = 'El token a expirado.'
            confirmar = 'Continuar con el registro'
            cerrar = 'Cerrar sesión'
            validar = 1
          } else {
            mensajito = res.mensaje;
            confirmar = 'Volver al registro'
            cerrar = 'Cerrar'
            validar = 2
          }
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: mensajito,
            showCancelButton: true,
            confirmButtonColor: '#094d74',
            cancelButtonColor: '#ffc72f',
            cancelButtonText: cerrar,
            confirmButtonText: confirmar
          }).then((result) => {
            if (result.isConfirmed) {
              this.verCajapago = true;
              if (validar == 1) {
                this.nuevoToken(this.loginService)
              }
            } else {
              if (validar == 1) {
                sessionStorage.removeItem('access_user')
                sessionStorage.removeItem('access_user_token')
                sessionStorage.removeItem('access_menu')
               // this.router.navigate(['/auth/login']); 
              }

            }
          })
        }
      }).catch(error => error);
  }

}
