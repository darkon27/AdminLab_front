import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { EmpresaBuscarComponent } from '../../../framework-comun/Empresa/view/empresa-buscar.component';
import { FiltroServicio } from '../../../framework-comun/Examen/dominio/filtro/FiltroExamen';
import { ExamenService } from '../../../framework-comun/Examen/servicio/Examen.service';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { FacturacionMantenimientoComponent } from '../components/facturacion-mantenimiento.component';
import { filtroComprobante } from '../model/filtro.Comprobante';
import { ComprobanteService } from '../service/Comprobante.services';


@Component({
  selector: 'ngx-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent extends ComponenteBasePrincipal  implements OnInit,UIMantenimientoController {
  @ViewChild(FacturacionMantenimientoComponent, { static: false }) facturacionMantenimientoComponent: FacturacionMantenimientoComponent; 
  @ViewChild(EmpresaBuscarComponent, { static: false }) empresaBuscarComponent: EmpresaBuscarComponent;
  
  
  dto:Maestro[]=[];
  Auth: UsuarioAuth = new UsuarioAuth();
  disableBtnGuardar:  boolean;
  bloquearPag:  boolean;
  editarCampos: boolean;
  editarCampoEmpresa: boolean;
  seleccion:    any;
  filtro: filtroComprobante= new filtroComprobante();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  servicio: FiltroServicio = new FiltroServicio();

  lstComprobante: any[] = [];
  lstCompania: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];
  lstSerie: SelectItem[] = [];
  lstSede: SelectItem[] = [];
  lstClasificadorMovimiento: SelectItem[] = [];

  lstTipoVenta: SelectItem[] = [];
  lstTipoImpuesto: SelectItem[] = [];
  lstMedioPago: SelectItem[] = [];
  lstTipoConcepto: SelectItem[] = [];
  
  constructor(
    private ComprobanteService: ComprobanteService,
    private MaestroSucursalService: MaestroSucursalService,
    private personaService: PersonaService,
    private examenService: ExamenService,
    private maestrocompaniaMastService: MaestrocompaniaMastService) {
    super();
  }
  
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreNuevo(): void {
    this.facturacionMantenimientoComponent.iniciarComponente("NUEVO",this.objetoTitulo.menuSeguridad.titulo)
  }

  async coreBuscar() {
    this.bloquearPag = true;
    console.log("Facturacion coreBuscar:", this.filtro);
    this.ComprobanteService.ListarComprobante(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = res.length;
      res.forEach((element) => {
        element.num = contado--;
      });
      this.lstComprobante = res;
      console.log("Facturacion coreBuscar listado:", res);
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

  coreVer(dto){
    console.log(this.objetoTitulo)
    this.facturacionMantenimientoComponent.iniciarComponente("VER",this.objetoTitulo.menuSeguridad.titulo,dto)
  }

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    const p1 = this.listaComboEstado();
    const p2 = this.listaComboTipoComprobante();
    const p3 = this.listaCombocompania();
    const p4 = this.listaComboClasificadorMovimiento();
    const p5 = this.listaComboTipoVenta();
    const p6 = this.listaComboMedioPago();
    const p7 = this.listaComboTipoImpuesto();
    const p8 = this.listaComboTipoConcepto();

    Promise.all([p1, p2, p3,p4,p5, p6, p7, p8]).then(resp => {
      this.fechaActual();     
      this.bloquearPag = false;
    });

  }

  fechaActual() {
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() + 1;
    var anio = hoy.getFullYear();
    this.filtro.FechaEmision = new Date(`${anio},${mes},${dia}`);
    this.filtro.FechaVencimiento = new Date(hoy);
    console.log("fechaActual FechaEmision", this.filtro.FechaEmision);
  }

  coreEditar(dto){
    this.facturacionMantenimientoComponent.iniciarComponente("EDITAR",this.objetoTitulo.menuSeguridad.titulo,dto)
  }

  listaComboEstado() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTFAC").forEach(i => {
      this.lstEstado.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("llego cargarComboEstados", this.lstEstado);
  }

  listaComboTipoComprobante() {
    this.lstTipoComprobante = [];
    this.lstTipoComprobante.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipoComprobante.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("llego cargarComboTipoComprobante", this.lstTipoComprobante);
  }

  listaComboTipoVenta() {
    this.lstTipoVenta = [];
    this.lstTipoVenta.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIPVEN").forEach(i => {
      this.lstTipoVenta.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("llego listaComboTipoVenta", this.lstTipoVenta);
  }

  listaComboTipoImpuesto() {
    this.lstTipoImpuesto = [];
    this.lstTipoImpuesto.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIPOIMPUESTO").forEach(i => {
      this.lstTipoImpuesto.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("llego listaComboTipoImpuesto", this.lstTipoImpuesto);
  }

  listaComboMedioPago() {
    this.lstMedioPago = [];
    this.lstMedioPago.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "MEDPAG").forEach(i => {
      this.lstMedioPago.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("llego listaComboTipoImpuesto", this.lstMedioPago);
  }

  listaComboTipoConcepto() {
    this.lstTipoConcepto = [];
    this.lstTipoConcepto.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "CPTOFACTURACION").forEach(i => {
      this.lstTipoConcepto.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("llego listaComboTipoImpuesto", this.lstTipoConcepto);
  }

  listaCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
      console.log("listarCompaniaMast", res);
      res.forEach(ele => {
        //  this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
        this.lstCompania.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
      });
      return 1;
    });
  }

  listaComboClasificadorMovimiento(): Promise<number> {
    this.Auth = this.getUsuarioAuth();
    var service = this.Auth.data;
    this.servicio.Estado = 1;
    this.lstClasificadorMovimiento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.examenService.serviciopaginado(this.servicio).then(resp => {
      resp.forEach(e => {
        this.lstClasificadorMovimiento.push({ label: e.Nombre, value: e.ClasificadorMovimiento });
      });
      this.filtro.ClasificadorMovimiento = service[0].ClasificadorMovimiento;
      console.log("listaComboClasificadorMovimiento", resp);
      return 1;
    });
  }
  
  
  listarSucursal(): Promise<number> {
    let filtroSucursal = { Estado:  "A" };
    this.lstSede.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.MaestroSucursalService.ListarSucursal(filtroSucursal).then(resp => {
      resp.forEach(e => {
        this.lstSede.push({ label: e.DescripcionLocal, value: e.Sucursal });
      });
      console.log("listarSucursal", resp);
      return 1;
    });
  }


  validarEnterEmpresa(evento) {

    if (evento.key == "Enter") {
      this.bloquearPag = true;
      if (this.filtro.DocumentoCliente == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        setTimeout(() => {
          this.bloquearPag = false;
        }, 500);
      } else if (this.filtro.DocumentoCliente.length == 11 || this.filtro.DocumentoCliente == "0") {

        if (this.filtro.DocumentoCliente == "0") {
          this.filtro.NombreCliente = "NO DEFINIDO"
          this.filtro.DocumentoCliente = this.filtro.DocumentoCliente.trim();
          this.filtro.TipoDocumento = "R";
        } else {
          this.filtro.DocumentoCliente = this.filtro.DocumentoCliente.trim();
          this.filtro.TipoDocumento = "R";
        }

        this.personaService.listarpaginado(this.filtro).then((res) => {

          console.log("enter empresa", res)
          if (res.length > 0) {

            this.filtro.NombreCliente = res[0].NombreCompleto;
            this.filtro.IdClienteFacturacion = res[0].Persona;
            this.editarCampoEmpresa = true;
            setTimeout(() => {
              this.bloquearPag = false;
            }, 500);
          } else {
            setTimeout(() => {
              this.bloquearPag = false;
              this.filtro.DocumentoCliente = null;
            }, 100);

            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
          }
        });
      }
      else {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        setTimeout(() => {
          this.bloquearPag = false;
          this.filtro.DocumentoCliente == null;
        }, 500);

      }
    }
  }

  limpiarEmpresa() {
    this.filtro.IdClienteFacturacion = null;
    this.filtro.DocumentoCliente = null;
    this.filtro.NombreCliente = null;
    this.editarCampoEmpresa = false;
  }
  
  verSelectorEmpresa(): void {
    // this.personaBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
    this.empresaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECEMPRESA', 'BUSCAR'), 'BUSCAR');
  }

}
