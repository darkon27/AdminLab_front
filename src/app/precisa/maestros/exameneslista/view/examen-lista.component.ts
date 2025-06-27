import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { DtoListaComponente } from '../../../framework-comun/Examen/dominio/dto/DtoListaComponente';
import { ExamenService } from '../../../framework-comun/Examen/servicio/Examen.service';
import { listabaseServices } from '../../lista-base/service/listabase.service';
import { ExamenListaMantenimientoComponent } from '../components/examen-lista-mantenimiento.component';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-examen-lista',
  templateUrl: './examen-lista.component.html',
  styleUrls: ['./examen-lista.component.scss']
})
export class ExamenListaComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController{
  @ViewChild(ExamenListaMantenimientoComponent, { static: false }) examenListaMantenimientoComponent: ExamenListaMantenimientoComponent;
  bloquearPag: boolean;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  
  filtro: DtoListaComponente = new DtoListaComponente();
  lstListaBase: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstListaBaseComponente: any[] = [];


  constructor(
    private messageService: MessageService,
    private ExamenService: ExamenService,
    private listabaseServices: listabaseServices,
    private confirmationService: ConfirmationService,
    private toastrService: NbToastrService) {
    super();
  }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }

  coreMensaje(mensage: MensajeController): void {

  }

  coreNuevo(): void {
    this.examenListaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_NUEVO + 'EXAMEN_LISTA_BASE', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo, 0, {});
    }

  coreBuscar(): void {
    this.bloquearPag = true;
    this.listabaseServices.ListadoBase(this.filtro).then((res) => {
      var contado = 1;
      res?.forEach(element => {
        element.num = contado++;
      });
      this.lstListaBaseComponente = res?.length > 0 ? res : [];
      this.bloquearPag = false;
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

  coreVer(row: any): void{
    this.examenListaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_VER + 'TIPO_TRABAJADOR', ''), ConstanteUI.ACCION_SOLICITADA_VER, this.objetoTitulo.menuSeguridad.titulo, 0, row);
  }

  coreEditar(row: any): void{
    this.examenListaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_EDITAR + 'TIPO_TRABAJADOR', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, this.objetoTitulo.menuSeguridad.titulo, 0, row)
  }

  coreinactivar(row) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: () => {
        row.SedEstado = 2;
        this.listabaseServices.MantenimientoBase(3, row, this.getUsuarioToken()).then(
          res => {
            if (res != null) {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Inactivado con éxito.' });
              this.coreBuscar();
            }
          });
      },

    });
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    //console.log("ngOnInit::");
    const p4 = this.tituloListadoAsignar(1, this);
    Promise.all([p4]).then(
      f => {
        setTimeout(() => {
          this.cargarFuncionesIniciales();
          this.bloquearPag = false;
        }, 100);
      });
    this.bloquearPag = false;
  }

  async cargarFuncionesIniciales() {
    await this.iniciarComponent();
    await this.cargarComboEstados();
    await this.cargarComboListaBase();
    //console.log("cargarFuncionesIniciales::");
  }


  cargarComboEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre, value: i.Codigo })
    });
  }


  cargarComboListaBase() {
    let dto = {  Estado: 1  }
    this.lstListaBase = [];
    this.lstListaBase.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.listabaseServices.ListadoBase(dto).then(res => {
    //console.log("cargarComboListaBase::", res);
        res.forEach(ele => {
            this.lstListaBase.push({ label: ele.Nombre.trim(), value: ele.IdListaBase });
        });
    });
  }

  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }


}
