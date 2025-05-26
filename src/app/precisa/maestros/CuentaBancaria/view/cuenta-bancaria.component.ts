import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../FormMaestro/model/maestro';
// import { CuentaBancariaBuscarComponent } from '../components/cuenta-bancaria-buscar.component';
import { CuentaBancariaMantenimientoComponent } from '../components/cuenta-bancaria-mantenimiento.component';
import { CuentaBancaria } from '../model/Cuenta-Bancaria';
import { CuentaBancariaService } from '../services/cuenta-bancaria.service';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { forkJoin } from 'rxjs';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-cuenta-bancaria',
  templateUrl: './cuenta-bancaria.component.html',
  styleUrls: ['./cuenta-bancaria.component.scss']
})
export class CuentaBancariaComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController{

  @ViewChild(CuentaBancariaMantenimientoComponent, { static: false }) componentMantenimientoComponent: CuentaBancariaMantenimientoComponent;
  // @ViewChild(CuentaBancariaBuscarComponent, { static: false }) componentBuscarComponent: CuentaBancariaBuscarComponent;
  
  bloquearPag: boolean;
  tipocambio:number=4.00
  igv:0.18
  btnNuevoAccion?: boolean;
  btnGuardar?: boolean;
  btnEliminar?: boolean;

  filtro: CuentaBancaria = new CuentaBancaria();
  lstCuentaBancaria: CuentaBancaria[] = [];
  lstEstado: SelectItem[] = [];
  lstBanco: SelectItem[] = [];
  dto: Maestro[]=[];
  BancoNumero: number;

  constructor(
      private _MessageService: MessageService,
      private _ConfirmationService: ConfirmationService,
      private _CuentaBancariaService: CuentaBancariaService,
      private toastrService: NbToastrService) {
      super();
    }
  
  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    this.cargarSelect();
    this.cargarEstados();
  }
  // ngOnInit(): void {
  //   this.tituloListadoAsignar(1, this);
  //   this.iniciarComponent()
  //   let dw = new Maestro()
  //   dw.CodigoTabla="01"
  //   dw.Descripcion="PRUEBA DESCRI"
  //   dw.Nombre="NOMBRE DETALLE"
  //   dw.Estado=2
  //   this.dto.push(dw)
    
  // }

  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOTODOS, value: null };
    forkJoin({
      estados: this.obtenerDataMaestro('ESTLETRAS'),
      bancos: this._CuentaBancariaService.ListarBanco({Estado: "A"}),
    }
    ).subscribe(resp => {
      // const dataEstados = resp.estados?.map((ele: any) => ({
      //   label: ele.label?.trim()?.toUpperCase() || "", value: Number.parseInt(ele.value)
      // }));
      // this.lstEstado = [optTodos, ...dataEstados];
      const dataBancos = resp.bancos?.map((ele: any) => ({
        label: ele.DescripcionCorta?.trim()?.toUpperCase() || "", value: `${ele.BancoNumero || 0}`
      }));
      this.lstBanco = [optTodos, ...dataBancos];
    });
  }
  coreBuscar(): void {
    this.bloquearPag = true;
    this._CuentaBancariaService.Listacuentabancariaa(this.filtro).then((res) => {
      var contado = 1;
      res?.forEach(element => {
        element.num = contado++;
      });
      this.lstCuentaBancaria = res?.length > 0 ? res : [];
      this.bloquearPag = false;
    });
  }

  cargarEstados() {
    this.lstEstado = [];
          this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
          this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
            ////console.log("i", i);
            this.lstEstado.push({ label: i.Nombre, value: i.Codigo });
          });
      }
  
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }


  coreNuevo(): void {
    this.componentMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_NUEVO + 'CUENTA-BANCARIA', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo, 0, {});
  }
  coreVer(row: any) {
    this.componentMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_VER + 'CUENTA-BANCARIA', ''), ConstanteUI.ACCION_SOLICITADA_VER, this.objetoTitulo.menuSeguridad.titulo, 0, row);
  }
  coreEditar(row: any) {
    this.componentMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_EDITAR + 'CUENTA-BANCARIA', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, this.objetoTitulo.menuSeguridad.titulo, 0, row);
  }

  coreMensaje(mensage: MensajeController): void {
    const dataDevuelta = mensage.resultado;

    switch (mensage.componente.toUpperCase()) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO + 'CUENTA-BANCARIA':
      case ConstanteUI.ACCION_SOLICITADA_EDITAR + 'CUENTA-BANCARIA':
        this.coreBuscar();
        break;
      default:
        break;
    }
  }

  coreinactivar(dtoInactivar) {
    this._ConfirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm",
      accept: async () => {
        /**AUDITORIA */
        dtoInactivar.UltimoUsuario = this.getUsuarioAuth().data[0].Documento;
        dtoInactivar.UltimaFechaModif = new Date();
        dtoInactivar.Estado = 'A';
        const respInactivar = await this._CuentaBancariaService.mantenimientoCuentaBancaria(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, dtoInactivar, this.getUsuarioToken());
        if (respInactivar != null) {
          if (respInactivar.success) {
            this.messageShow('success', 'success', this.getMensajeInactivo());
            this.coreBuscar();
          } else {
            this.messageShow('warn', 'Advertencia', this.getMensajeErrorinactivar());
          }
        } else {
          this.messageShow('warn', 'Advertencia', this.getMensajeErrorinactivar());
        }
      }
    });
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this._MessageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }
  
  // verSelectorEmpresa(): void {
  //    this.componentBuscarComponent.iniciarComponente("BUSCADOR EMPRESAS", this.objetoTitulo.menuSeguridad.titulo)
  // }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }


  //openNew() {
    //this.componentMantenimientoComponent.iniciarComponente("NUEVO",this.objetoTitulo.menuSeguridad.titulo)
    
  //}
  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this._MessageService.clear();
    this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }
  
 
}
