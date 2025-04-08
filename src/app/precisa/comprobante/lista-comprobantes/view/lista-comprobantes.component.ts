import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { filtroComprobante } from '../../../liquidacion/facturacion/model/filtro.Comprobante';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { ListaComprobantesMantenimientoComponent } from '../components/lista-comprobantes-mantenimiento.component';

@Component({
  selector: 'ngx-lista-comprobantes',
  templateUrl: './lista-comprobantes.component.html',
  styleUrls: ['./lista-comprobantes.component.scss']
})

export class ListaComprobantesComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(ListaComprobantesMantenimientoComponent, { static: false }) listaComprobantesMantenimientoComponent: ListaComprobantesMantenimientoComponent;
  
  editarCampoDocumento: boolean = false;
  loading: boolean;
  bloquearPag: boolean;

  Auth: UsuarioAuth = new UsuarioAuth();
  filtro: filtroComprobante = new filtroComprobante();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();

  lstEstado: SelectItem[] = [];
  lstTipocomprobante: SelectItem[] = [];
  lstCompania: SelectItem[] = [];
  lstsedes: SelectItem[] = [];

  
  dto: Maestro[]=[];

  constructor(
    private messageService: MessageService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private MaestroSucursalService: MaestroSucursalService,
    private confirmationService: ConfirmationService,
    private toastrService: NbToastrService) {
    super();
  }

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent(); 
    const p2 = this.cargarEstados();
    const p1 = this.cargarTipocomprobante();
    const p4 = this.cargarCompania();
    const p3 = this.listarSucursal();

    Promise.all([p1, p2, p3, p4]).then(
      f => {

        this.fechaActual();
        setTimeout(() => {
          this.bloquearPag = false;
        }, 100);
      });

    let dw = new Maestro()
    dw.CodigoTabla="01"
    dw.Descripcion="PRUEBA DESCRI"
    dw.Nombre="NOMBRE DETALLE"
    dw.Estado=2
    this.dto.push(dw)
  }


  fechaActual() {
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() + 1;
    var anio = hoy.getFullYear();
    this.filtro.FechaEmision = new Date(`${anio},${mes},${dia}`);
    this.filtro.FechaVencimiento = new Date(`${anio},${mes},${dia}`);
    console.log("Consulta Admision fecha creacion", this.filtro.FechaEmision)
  }

  coreNuevo(): void {
    this.listaComprobantesMantenimientoComponent.iniciarComponente("NUEVO",this.objetoTitulo.menuSeguridad.titulo)
  }

  coreBuscar(): void {
    throw new Error('Method not implemented.');
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
    this.listaComprobantesMantenimientoComponent.iniciarComponente("VER",this.objetoTitulo.menuSeguridad.titulo)
  }

  coreEditar(dto){
    this.listaComprobantesMantenimientoComponent.iniciarComponente("EDITAR",this.objetoTitulo.menuSeguridad.titulo)
  }
  
  cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTFAC").forEach(i => {
      this.lstEstado.push({ label: i.Nombre, value: i.IdCodigo })
    });
  }

  cargarTipocomprobante() {
    this.lstTipocomprobante = [];
    this.lstTipocomprobante.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipocomprobante.push({ label: i.Nombre, value: i.IdCodigo })
    });
  }

  cargarCompania() {
      this.FiltroCompan.estado = "A";
      this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
        console.log("Cobranza listarCompaniaMast", res);
        res.forEach(ele => {
          this.lstCompania.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
        });
        return 1;
      });
    }

   
    listarSucursal(): Promise<number> {
      let filtroSucursal = { Estado:  "A" };
      this.lstsedes.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      return this.MaestroSucursalService.ListarSucursal(filtroSucursal).then(resp => {
        resp.forEach(e => {
          this.lstsedes.push({ label: e.DescripcionLocal, value: e.Sucursal });
        });
        console.log("Cobranza listarSucursal", resp);
        return 1;
      });
    }

}
