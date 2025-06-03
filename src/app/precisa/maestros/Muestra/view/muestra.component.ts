import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { MuestrasMantenimientoComponent } from '../components/muestra-mantenimiento.component';
import { MuestraModel } from '../model/Muestra';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { MuestraService } from '../service/MuestraService';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';

@Component({
  selector: 'ngx-muestra',
  templateUrl: './muestra.component.html',
  styleUrls: ['./muestra.component.scss']
})
export class MuestraComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(MuestrasMantenimientoComponent, { static: false }) muestraMantenimientoComponent: MuestrasMantenimientoComponent;
  bloquearPag: boolean;
  filtro: MuestraModel = new MuestraModel();
  lstEstado: SelectItem[] = [];
  lstMuestra: SelectItem[] = [];
  position: string = 'top'
  titulo: string; 
  registroSeleccionado: any;
  loading: boolean;

  constructor(
    private MuestraService: MuestraService,
    private _ConfirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    super(); }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }
  
  

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.cargarFuncionesIniciales();
  }

  async cargarFuncionesIniciales() {
    await this.iniciarComponent();
    await this.cargarEstados();
    // await this.comboCargarTipoAdmision();    
  }

  coreNuevo(): void {
    this.muestraMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_NUEVO + 'MUESTRA', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo, 0, {});
  }

  coreEditar(dto): void {
    this.muestraMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_EDITAR + 'MUESTRA', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, this.objetoTitulo.menuSeguridad.titulo,0, dto);  
  }

  coreVer(row: any): void {
    this.muestraMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, ConstanteUI.ACCION_SOLICITADA_VER + 'MUESTRA', ''), ConstanteUI.ACCION_SOLICITADA_VER, this.objetoTitulo.menuSeguridad.titulo,0, row);  
  }

  coreInactivar(data: any) {
    //console.log("llego coreInvactivar", event);
    this._ConfirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: () => {
        this.bloquearPag = true;
        data.Estado = "2";
        data.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
        this.MuestraService.MantenimientoMuestra(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, data, this.getUsuarioToken()).then(
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

  coreBuscar(): void {
    if (!this.estaVacio(this.filtro.Nombre)) {
      this.filtro.Nombre = this.filtro.Nombre.trim();
    }
    //console.log("Filtro enviado:", this.filtro); // Verifica el contenido del filtro
    this.bloquearPag = true;
    this.MuestraService.ListadoMuestra(this.filtro).then((res) => {
        this.bloquearPag = false;
        var contado = 1;
        res.forEach(element => {
          element.num = contado++;
        });
        this.lstMuestra = res;
        //console.log("coreBuscar listado:", res); // Verifica la respuesta del servicio
      });
  } 

  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
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
  cargarEstados() {
      this.lstEstado = [];
      this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
        this.lstEstado.push({ label: i.Nombre, value: i.IdCodigo });
      });
      this.filtro.Estado=1;
    }

    coreMensaje(mensage: MensajeController): void {
      const dataDevuelta = mensage.resultado;
  
      switch (mensage.componente.toUpperCase()) {
        case ConstanteUI.ACCION_SOLICITADA_NUEVO + 'MUESTRA':
        case ConstanteUI.ACCION_SOLICITADA_EDITAR + 'MUESTRA':
          this.coreBuscar();
          break;
        default:
          break;
      }
    }
  

  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
      this.messageService.clear();
      this.messageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
    } 


}
