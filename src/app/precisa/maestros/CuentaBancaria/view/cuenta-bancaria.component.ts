import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../FormMaestro/model/maestro';
import { CuentaBancariaBuscarComponent } from '../components/cuenta-bancaria-buscar.component';
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
  @ViewChild(CuentaBancariaBuscarComponent, { static: false }) componentBuscarComponent: CuentaBancariaBuscarComponent;
  
  bloquearPag: boolean;
  tipocambio:number=4.00
  igv:0.18
  btnNuevoAccion?: boolean;
  btnGuardar?: boolean;
  btnEliminar?: boolean;

  filtro: CuentaBancaria = new CuentaBancaria();
  lstCuentaBancaria: CuentaBancaria[] = [];
  lstEstado: SelectItem[] = [];
  dto: Maestro[]=[];

  constructor(
      private _MessageService: MessageService,
      private _ConfirmationService: ConfirmationService,
      private _CuentaBancariaService: CuentaBancariaService,
      private toastrService: NbToastrService) {
      super();
    }
  
  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    this.cargarSelect();
    this.bloquearPag = false;
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
      estados: this.obtenerDataMaestro('ESTGEN'),
    }
    ).subscribe(resp => {
      const dataEstados = resp.estados?.map((ele: any) => ({
        label: ele.label?.trim()?.toUpperCase() || "", value: Number.parseInt(ele.value)
      }));
      this.lstEstado = [optTodos, ...dataEstados];
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
  
  coreEliminar(): void {
    this._ConfirmationService.confirm({
      message: '¿Está seguro de eliminar el registro?',
      accept: () => {
        this.toastrService.show('', 'Registro eliminado', { status: 'success' });
        this.coreBuscar();
      }
    });
  }

  coreNuevo(): void {
    this.componentMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_NUEVO + 'CUENTA-BANCARIA', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo, 0, {});
  }
  coreVer(row: any) {
    this.componentMantenimientoComponent.iniciarComponente("VER", this.objetoTitulo.menuSeguridad.titulo);
  }
  coreEditar(row: any) {
    this.componentMantenimientoComponent.iniciarComponente("EDITAR", this.objetoTitulo.menuSeguridad.titulo);
  }

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }
  
  verSelectorEmpresa(): void {
     this.componentBuscarComponent.iniciarComponente("BUSCADOR EMPRESAS", this.objetoTitulo.menuSeguridad.titulo)
  }
  coreGuardar(): void {
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
  
 
}
