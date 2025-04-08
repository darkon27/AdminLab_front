import { Component, OnDestroy, OnInit } from "@angular/core";
import { SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { FiltroServicio } from "../../../framework-comun/Examen/dominio/filtro/FiltroExamen";
import { ExamenService } from "../../../framework-comun/Examen/servicio/Examen.service";
import { PersonaService } from "../../../framework-comun/Persona/servicio/persona.service";
import { MaestrodetalleService } from "../../../maestros/Detalle/servicio/maestrodetalle.service";
import { Maestro } from "../../../maestros/FormMaestro/model/maestro";
import { MaestroSucursalService } from "../../../maestros/Sedes/servicio/maestro-sucursal.service";
import { FiltroCompaniamast } from "../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { dtoComprobante } from "../model/dtoComprobante";
import { dtoComprobanteDetalle } from "../model/dtoComprobanteDetalle";
import { filtroComprobante } from "../model/filtro.Comprobante";
import { ComprobanteService } from "../service/Comprobante.services";



@Component({
    selector: 'ngx-facturacion-mantenimiento',
    templateUrl: './facturacion-mantenimiento.component.html'
  })
export class FacturacionMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController {
 

  bloquearPag: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  Auth: UsuarioAuth = new UsuarioAuth();
  acciones: string = ''
  position: string = 'top'
  dto:dtoComprobante= new dtoComprobante();
  disableBtnGuardar:  boolean;
  editarCampos: boolean;
  editarCampoEmpresa: boolean;
  seleccion:    any;

  filtro: filtroComprobante= new filtroComprobante();

  dtodet: dtoComprobanteDetalle= new dtoComprobanteDetalle();  
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  servicio: FiltroServicio = new FiltroServicio();

  lstComprobante: any[] = [];
  lstComprobanteDetalle: any[] = [];
  lstCompania: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];
  lstSerie: SelectItem[] = [];
  lstSede: SelectItem[] = [];
  lstClasificadorMovimiento: SelectItem[] = [];
  lstTipoConcepto: SelectItem[] = [];
  lstTipoVenta: SelectItem[] = [];
  lstTipoImpuesto: SelectItem[] = [];
  lstFormaPago: SelectItem[] = [];
  lstMoneda: SelectItem[] = [];
  lstTipoPago: SelectItem[] = [];

  
  constructor(
    private ComprobanteService: ComprobanteService,
    private MaestroSucursalService: MaestroSucursalService,
    private MaestrodetalleService: MaestrodetalleService,
    private examenService: ExamenService,
    private maestrocompaniaMastService: MaestrocompaniaMastService) {
    super();
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


  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    const p1 = this.listaComboEstado();
    const p2 = this.listaComboTipoComprobante();
    const p3 = this.listaCombocompania();
    const p4 = this.listaComboClasificadorMovimiento();
    const p5 = this.listarSucursal();
    const p6 = this.listaComboTipoConcepto();
    const p7 = this.listaComboTipoVenta();
    const p8 = this.listaComboTipoImpuesto();
    const p9 = this.listaComboMedioPago();
    const p10 = this.ListarMoneda();
    Promise.all([p1, p2, p3,p4,p5,p6, p7,p8,p9,p10]).then(resp => {
      this.fechaActual();     
      this.ListarTipoPago();
      this.lstSerie.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.bloquearPag = false;
    });
  }

  iniciarComponente(accion: string,titulo,dto?: any) {
    if (accion) {
      this.cargarAcciones(accion,titulo)     
       if (accion=="NUEVO") 
        {
          this.dto = new dtoComprobante();
          this.fechaActual();
        }else{
        console.log("Facturacion Reg iniciarComponente", dto);
        this.filtro = new filtroComprobante();
        let ObjComprobante = { IdComprobante:  dto.IdComprobante };
        this.ComprobanteService.ListarComprobante(ObjComprobante).then(resp => {
            resp.forEach((element) => {
              this.dto = element;
            });
            console.log("ListarComprobante ::",   this.dto);
            this.listaComprobanteDetalle(this.dto);
            
            if (!this.esFechaVacia(dto.FechaEmision)) {
              this.dto.FechaEmision = new Date(dto.FechaEmision);
              }

            if (!this.esFechaVacia(dto.FechaVencimiento)) {
              this.dto.FechaVencimiento = new Date(dto.FechaVencimiento);
              }
      
              if (!this.esFechaVacia(dto.FechaCancelacion)) {
                this.dto.FechaCancelacion = new Date(dto.FechaCancelacion);
              }
            
              this.selectedItemTipoComprobante(this.dto.TipoComprobante);
      
              if (!this.estaVacio(dto.UsuarioCreacion)){
                if(this.getUsuarioAuth().data[0].Usuario.trim() == dto.UsuarioCreacion.trim() )  
                {
                  this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
                }
              }
      
              if (!this.estaVacio(dto.UsuarioModificacion)){
                if(this.getUsuarioAuth().data[0].Usuario.trim() == dto.UsuarioModificacion.trim() )  
                {
                  this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
                }
              }
      
              if (!this.esFechaVacia(dto.FechaCreacion))
              {
                this.fechaCreacion = new Date(dto.FechaCreacion);   
              }
             // undefined
              if (!this.esFechaVacia(dto.fechaModificacion))
              {
                this.fechaModificacion = dto.fechaModificacion; 
              }else{
                this.fechaModificacion =new Date();
              } 
          });      
      }
    }
  }
  
  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;
      this.dialog = true;
      this.puedeEditar = false;
    
  }

  fechaActual() {
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() - 1;
    var anio = hoy.getFullYear();
    this.filtro.FechaEmision = new Date(`${anio},${mes},${dia}`);
    this.filtro.FechaVencimiento = new Date(hoy);
    console.log("Facturacion fecha creacion", this.filtro.FechaEmision);
  }

  listaComboEstado() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTFAC").forEach(i => {
      this.lstEstado.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("Facturacion cargarComboEstados", this.lstEstado);
  }

  listaComboTipoComprobante() {
    this.lstTipoComprobante = [];
    this.lstTipoComprobante.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipoComprobante.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("Facturacion cargarComboTipoComprobante", this.lstTipoComprobante);
  }

  listaComboTipoConcepto() {
    this.lstTipoConcepto = [];
    this.lstTipoConcepto.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "CPTOFACTURACION").forEach(i => {
      this.lstTipoConcepto.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("Facturacion listaComboTipoConcepto", this.lstTipoConcepto);
  }
  
  listaComboTipoVenta() {
    this.lstTipoVenta = [];
    this.lstTipoVenta.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPVEN").forEach(i => {
      this.lstTipoVenta.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("Facturacion listaComboTipoVenta", this.lstTipoVenta);
  }

  listaComboTipoImpuesto() {
    this.lstTipoImpuesto = [];
    this.lstTipoImpuesto.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOIMPUESTO").forEach(i => {
      this.lstTipoImpuesto.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("Facturacion listaComboTipoImpuesto", this.lstTipoImpuesto);
  }

  listaComboMedioPago() {
    this.lstFormaPago = [];
    this.lstFormaPago.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "MEDPAG").forEach(i => {
      this.lstFormaPago.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("Facturacion listaComboMedioPago", this.lstFormaPago);
  }

  listaCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania = [];
    this.lstCompania.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {    
      res.forEach(ele => {
        //  this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
        this.lstCompania.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.CompaniaCodigo.trim()+"00", title: ele.Persona });
      });
      console.log("Facturacion listarCompaniaMast",  this.lstCompania);
      return 1;
    });
  }

  listaComboClasificadorMovimiento(): Promise<number> {
    this.Auth = this.getUsuarioAuth();
    var service = this.Auth.data;
    this.servicio.Estado = 1;
    this.lstClasificadorMovimiento = [];
    this.lstClasificadorMovimiento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.examenService.serviciopaginado(this.servicio).then(resp => {
      resp.forEach(e => {
        this.lstClasificadorMovimiento.push({ label: e.Nombre, value: e.ClasificadorMovimiento });
      });
      this.filtro.ClasificadorMovimiento = service[0].ClasificadorMovimiento;
      console.log("Facturacion listaComboClasificadorMovimiento", resp);
      return 1;
    });
  }
  
  
  listarSucursal(): Promise<number> {
    this.lstSede = [];
    let filtroSucursal = { Estado:  "A" };
    this.lstSede.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.MaestroSucursalService.ListarSucursal(filtroSucursal).then(resp => {
      resp.forEach(e => {
        this.lstSede.push({ label: e.DescripcionLocal, value: e.Sucursal });
      });
      console.log("Facturacion listarSucursal", resp);
      return 1;
    });
  }


  ListarMoneda(): Promise<number> {
    this.lstMoneda = [];
    let filtroMoneda = { Estado:  "A" };
    this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.MaestrodetalleService.ListarMoneda(filtroMoneda).then(resp => {
      resp.forEach(e => {
        this.lstMoneda.push({ label: e.DescripcionCorta, value: e.MonedaCodigo });
      });
      console.log("Facturacion filtroMoneda", resp);
      return 1;
    });
  }

  ListarTipoPago(){
    this.lstTipoPago = [];
    this.lstTipoPago.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstTipoPago.push({ label:"Efectivo", value: 15 });
    this.lstTipoPago.push({ label: "Tarjeta", value: 28 });
  }
 
  
  selectedItemCompania(event){
    console.log("Facturacion selectedItemCompania", event);
    if (this.filtro.TipoComprobante == null){
      this.lstSerie.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    }else{
      this.filtro.Compania = event;
      this.ListarSucursalSerie();
    }
  }

  selectedItemTipoComprobante(event){
    console.log("Facturacion selectedItemTipoComprobante", event);
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
      console.log("Facturacion filtroSerie ::", filtroSerie);
    this.lstSerie.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.ComprobanteService.ListarSucursalCompSerie(filtroSerie).then(resp => {
      resp.forEach(e => {
        this.lstSerie.push({ label: e.Serie, value: e.Serie.trim()});
      });
      console.log("Facturacion ListarSucursalSerie", resp);
      return 1;
    });
  }

  listaComprobanteDetalle(dto: dtoComprobante) {
    this.dtodet = new dtoComprobanteDetalle();
    this.dtodet.IdComprobante = dto.IdComprobante;
    return this.ComprobanteService.ListarComprobanteDetalle(this.dtodet).then(resp => {
      var contado = resp.length;
      resp.forEach((element) => {
        element.num = contado--;
      });
      this.lstComprobanteDetalle = resp;
      console.log("Facturacion listaComprobanteDetalle", resp);
    });
  }

  validarTeclaEnterExamen(): void {
    throw new Error('Method not implemented.');
  }

  verSelectorComponente(): void {
    throw new Error('Method not implemented.');
  }

  ValidarQuitarDetalle(): void {
    throw new Error('Method not implemented.');
  }

}
