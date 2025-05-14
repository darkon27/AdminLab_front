import { Component, OnInit } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { PortalService } from '../service/portal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  bloquearPag: boolean = false;
  btnGuardar?: boolean = true;
  btnNuevoAccion?: boolean = true;

  dto: any = {};
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  constructor(private _PortalService: PortalService,
    private _ConfirmationService: ConfirmationService,
    private _MessageService: MessageService,


  ) {
    super();
  }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }
  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }
  coreBuscar(): void {
    this.bloquearPag = true;
    this._PortalService.listarPortal({ IdPortal: 1, Estado: 1 }).then((res) => {

      if (res?.length > 0) {
        this.dto = res[0];
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date(this.dto.FechaModificacion);
        if (this.dto.FechaModificacion != null) {
          this.fechaModificacion = new Date(this.dto.FechaModificacion);
        }
      }
    });
    this.bloquearPag = false;
  }
  coreGuardar(): void {
    this._ConfirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿está seguro que desea realizar esta acción? ",
      key: "confirm",
      accept: async () => {
        this.bloquearPag = true;

        try {

          const consultaRepsonse = await this._PortalService.mantenimientoPortal(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.dto, this.getUsuarioToken());
          if (consultaRepsonse.success == true) {
            this.MensajeToastComun('notification', 'success', 'Correcto', consultaRepsonse.mensaje);
            this.coreBuscar();
          } else {
            this.MensajeToastComun('notification', 'warn', 'Advertencia', consultaRepsonse.mensaje);
          }
        }
        catch (error) {
          console.error(error)
          this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
          this.bloquearPag = false;
        } finally {
          this.bloquearPag = false;
        }
      },
    });
  }
  coreExportar(): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.coreBuscar();
  }
  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    // this._MessageService.clear();
    this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }
}
