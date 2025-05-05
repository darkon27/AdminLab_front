import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
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
import { CobranzasBuscarComponent } from '../components/cobranzas-buscar.component';
import { CobranzasMantenimientoComponent } from '../components/cobranzas-mantenimiento.component';
import { FiltroCobranza } from '../model/filtro.Cobranza';
import { CobranzaService } from '../service/cobranza.service';

@Component({
  selector: 'ngx-cobranzas',
  templateUrl: './cobranzas.component.html',
  styleUrls: ['./cobranzas.component.scss']
})
export class CobranzasComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(CobranzasBuscarComponent, { static: false }) cobranzasBuscarComponent: CobranzasBuscarComponent;
  @ViewChild(CobranzasMantenimientoComponent, { static: false }) cobranzasMantenimientoComponent: CobranzasMantenimientoComponent;
  @ViewChild(EmpresaBuscarComponent, { static: false }) empresaBuscarComponent: EmpresaBuscarComponent;
  
  

  dto:Maestro[]=[];
  Auth: UsuarioAuth = new UsuarioAuth();
  disableBtnGuardar:  boolean;
  bloquearPag:  boolean;
  editarCampos: boolean;
  editarCampoEmpresa: boolean;
  seleccion:    any;
  filtro: FiltroCobranza = new FiltroCobranza();
  lstCobranza: any[] = [];
  lstTipoCobranza: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  lstTipoAdmision: SelectItem[] = [];
  lstClasificadorMovimiento: SelectItem[] = [];
  servicio: FiltroServicio = new FiltroServicio();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();

  lstComprobante: any[] = [];
  lstCompania: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];
  lstSerie: SelectItem[] = [];
  lstSede: SelectItem[] = [];


  constructor(
    private CobranzaService: CobranzaService,
    private MaestroSucursalService: MaestroSucursalService,
    private personaService: PersonaService,
    private examenService: ExamenService,
    private maestrocompaniaMastService: MaestrocompaniaMastService) {
    super();
  }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreVer(dto): void{
    //console.log("Cobranza coreVer ::",dto)
    this.cobranzasMantenimientoComponent.coreIniciarComponente(new MensajeController(this, 'VER', ''),  dto); 
  } 
  
  coreEditar(dto): void{
    //console.log("Cobranza coreEditar ::",dto);
    this.cobranzasMantenimientoComponent.coreIniciarComponente(new MensajeController(this, 'EDITAR', ''),  dto);
  }

  coreNuevo(): void {
    this.cobranzasMantenimientoComponent.coreIniciarComponente(new MensajeController(this, 'NUEVO', ''),  ); 
  }


  coreAccion(accion: string): void {
    throw new Error('Method not implemented.');
  }


  coreBuscar(): void {
    this.bloquearPag = true;
    //console.log("Cobranza coreBuscar:", this.filtro);
    this.CobranzaService.ListarCobranza(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = res.length;
      res.forEach((element) => {
        element.num = contado--;
      });
      this.lstCobranza = res;
      //console.log("Cobranza coreBuscar listado:", res);
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

  verSelectorPacientes(): void {
    this.cobranzasBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
 }



  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    const p1 = this.listaComboEstado();
    const p2 = this.listaComboTipoComprobante();
    const p3 = this.listaCombocompania();
    const p4 = this.listaComboClasificadorMovimiento();
    const p5 = this.listarSucursal();
    Promise.all([p1, p2, p3,p4,p5]).then(resp => {
      this.fechaActual();     
      this.bloquearPag = false;
    });

  }


  fechaActual() {
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() - 1;
    var anio = hoy.getFullYear();
    this.filtro.FechaIngreso = new Date(`${anio},${mes},${dia}`);
    this.filtro.FechaPago = new Date(hoy);
    //console.log("Cobranza FechaPago", this.filtro.FechaIngreso);
  }

  listaComboEstado() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTFAC").forEach(i => {
      this.lstEstado.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    //console.log("Cobranza cargarComboEstados", this.lstEstado);
  }

  listaComboTipoComprobante() {
    this.lstEstado = [];
    this.lstTipoComprobante.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipoComprobante.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    //console.log("Cobranza cargarComboTipoComprobante", this.lstTipoComprobante);
  }

  listaCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
      //console.log("Cobranza listarCompaniaMast", res);
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
      //console.log("Cobranza listaComboClasificadorMovimiento", resp);
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
      //console.log("Cobranza listarSucursal", resp);
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

          //console.log("Cobranza empresa", res)
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
