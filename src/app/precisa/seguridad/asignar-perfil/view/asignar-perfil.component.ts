import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { AppSatate } from '../../app.reducer';
import * as actions from '../../perfi-usuarios/store/actions'
import { AsignarPerfilService } from '../service/asignar-perfil.service';
import { forkJoin } from 'rxjs';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-asignar-perfil',
  templateUrl: './asignar-perfil.component.html',
  styleUrls: ['./asignar-perfil.component.scss']
})
export class AsignarPerfilComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  btnGuardar?: boolean = true;
  btnNuevoAccion?: boolean = true;
  btnEliminar?: boolean;
  bloquearPag: boolean;

  filtro: any = {};
  dto: any = {};
  lstComboPerfiles: SelectItem[][] = [];
  lstPerfiles: any[] = [];
  lstPerfilesSeleccionados: any[] = [];

  constructor(private store: Store<AppSatate>,
    private _AsignarPerfilService: AsignarPerfilService,
    private _ConfirmationService: ConfirmationService,
    private _MessageService: MessageService,

  ) {
    super();
  }

  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreNuevo(): void {

  }

  coreBuscar(): void {
    this.bloquearPag = true;
    this._AsignarPerfilService.listarperfiles(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lstPerfiles = res;
      //console.log("coreBuscar listado:", res);
    });
  }
  coreGuardar(): void {

    if (this.dto.Perfil == null || this.dto.Perfil == undefined || this.dto.Perfil == '') {
      this.MensajeToastComun('notification', 'warn', 'Advertencia', `Debe seleccionar un perfil`);
      return;
    } else {
      this._ConfirmationService.confirm({
        header: "Confirmación",
        icon: "fa fa-question-circle",
        message: "¿Está seguro de aplicar el cambio de perfil a los usuarios seleccionados? ",
        key: "confirm",
        accept: async () => {
          this.bloquearPag = true;
          let contSolicitudes: number = 0;
          for (const usuario of this.lstPerfilesSeleccionados) {
            contSolicitudes++;
            usuario.Perfil = this.dto.Perfil;

            const respPerfiles = await this._AsignarPerfilService.mantenimientoPerfiles(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, usuario, this.getUsuarioToken());
            if (respPerfiles != null) {
              if (respPerfiles.success) {
                this.MensajeToastComun('notification', 'success', 'Actualización exitosa', `Se actualizó el perfil del usuario: ${usuario.NombreCompleto}`);
                this.coreBuscar();
              } else {
                this.MensajeToastComun('notification', 'warn', 'Advertencia', `no se logró actualizar el usuario: ${usuario.NombreCompleto}`);

              }
            } else {
              this.MensajeToastComun('notification', 'error', 'Advertencia', `Se gebneró un error al actualizar el usuario: ${usuario.NombreCompleto}`);
            }
          }
          if (contSolicitudes == this.lstPerfilesSeleccionados.length) {
            this.lstPerfilesSeleccionados = [];
          }

          this.bloquearPag = false;
        },
      });
    }
  }
  coreExportar(): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    this.cargarSelect();

  }
  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOTODOS, value: null };
    const optSeleccione = { label: ConstanteAngular.COMBOSELECCIONE, value: null };

    forkJoin({
      perfiles: this._AsignarPerfilService.listarComboPerfil({ ESTADO: "A" }),
    }
    ).subscribe(resp => {

      const dataPerfiles = resp.perfiles?.map((ele: any) => ({
        label: ele.Descripcion?.trim()?.toUpperCase() || "", value: `${ele.Codigo?.trim() || ""}`
      }));

      this.lstComboPerfiles.push([]);
      this.lstComboPerfiles.push([]);
      for (let index = 0; index < this.lstComboPerfiles.length; index++) {
        this.lstComboPerfiles[index] = [index == 0 ? optTodos : optSeleccione, ...dataPerfiles];
      }
    });
  }
  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    // this._MessageService.clear();
    this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }
}
