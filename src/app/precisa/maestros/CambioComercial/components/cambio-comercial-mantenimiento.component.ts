import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";
import { filtroParametros } from "../../Parametros/model/filtro.parametros";
import { Parametros } from "../../Parametros/model/parametros";
import { MensajeController } from "../../../../../util/MensajeController";
import { ParametrosService } from "../../Parametros/service/parametros.service";
import { MessageService, SelectItem } from "primeng/api";
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { PersonaService } from "../../../framework-comun/Persona/servicio/persona.service";
import { FiltroCompaniamast } from "../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { AuditoriaComponent } from "../../../../@theme/components/auditoria/auditoria.component";
import { CambioComercial } from "../model/CambioComercial";
import { CambioComercialService } from "../Service/cambioComercial.service";
import { forkJoin } from "rxjs";



@Component({
  selector: 'ngx-cambio-comercial-mantenimiento',
  templateUrl: './cambio-comercial-mantenimiento.component.html'
})
export class CambioComercialMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {

  titulo: string = ''
  accionRealizar: string = ''
  position: string = 'top'
  bloquearPag: boolean;
  validarform: string = null;
  visible: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  lstEstado: SelectItem[] = [];
  dto: CambioComercial = new CambioComercial();


  constructor(
    private messageService: MessageService,
    private _CambioComercialService: CambioComercialService
  ) {
    super();
  }
  ngOnInit(): void {
    this.cargarSelect();
    this.iniciarComponent();
  }
  cargarSelect(): void {
    const optTodos = { label: ConstanteAngular.COMBOTODOS, value: null };
    forkJoin({
      estados: this.obtenerDataMaestro('ESTLETRAS'),
    }
    ).subscribe(resp => {
      this.lstEstado = [...resp.estados];
    });
  }

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, titulo: string, page: number, data?: any): void {
    this.bloquearPag = true;
    this.mensajeController = mensaje;
    this.cargarAcciones(accionform, titulo, data)
    this.bloquearPag = false;

  }

  cargarAcciones(accion: string, titulo: string, rowdata?: any) {
    this.titulo = `${titulo}: ${accion}`;
    this.accionRealizar = accion;
    this.dialog = true;

    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.dto = new CambioComercial();
        this.dto.Estado = 'A';
        this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dto.FechaCreacion = new Date();
        this.puedeEditar = false;

        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
        this.fechaModificacion = null;
        break;

      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.dto = rowdata;
        this.puedeEditar = false;
        this.fechaModificacion = new Date();
        this.fechaCreacion = new Date(this.dto.FechaCreacion);
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

        this.dto.UsuarioModificacion = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dto.FechaModificacion = new Date();
        break;

      case ConstanteUI.ACCION_SOLICITADA_VER:
        this.dto = rowdata;

        this.puedeEditar = true;
        if (rowdata.FechaModificacion == null || rowdata.FechaModificacion == null) { this.fechaModificacion = null; }
        else { this.fechaModificacion = new Date(rowdata.FechaModificacion); }
        this.fechaCreacion = new Date(rowdata.FechaCreacion);
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        break;
    }

  }

  async coreGuardar() {
    if (this.estaVacio(this.dto.Valor)) {
        this.messageShow("warn", "Advertencia", "Ingrese un valor válido");
        return;
    }
    if (this.estaVacio(this.dto.Estado)) {
        this.messageShow("warn", "Advertencia", "Seleccione un estado válido");
        return;
    }

    if (this.validarform == "NUEVO") {
        this.bloquearPag = true;
        this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();
        this.dto.FechaCreacion = this.fechaCreacion;
        
        this._CambioComercialService.mantenimiento(1, this.dto, this.getUsuarioToken()).then(
            res => {
                this.bloquearPag = false;
                this.dialog = false;
                
                if (res != null) {
                    if (res.success == true) {
                        this.messageService.add({
                            key: "bc",
                            severity: "success",
                            summary: "Success",
                            detail: res.mensaje || "Se registró con éxito."
                        });
                        this.mensajeController.resultado = res;
                        this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                    } else {
                        this.messageService.add({
                            key: "bc",
                            severity: "warn",
                            summary: "Advertencia",
                            detail: res.mensaje
                        });
                    }
                }
            }
        ).catch(error => {
            console.error(error);
            this.messageService.add({
                key: "bc",
                severity: "error",
                summary: "Error",
                detail: "Se generó un error. Póngase en contacto con los administradores."
            });
            this.bloquearPag = false;
        });
    } else if (this.validarform == "EDITAR") {
        this.bloquearPag = true;
        this.dto.FechaModificacion = this.fechaModificacion;
        
        this._CambioComercialService.mantenimiento(2, this.dto, this.getUsuarioToken()).then(
            res => {
                this.bloquearPag = false;
                this.dialog = false;
                
                if (res != null) {
                    if (res.success == true) {
                        this.messageService.add({
                            key: "bc",
                            severity: "success",
                            summary: "Success",
                            detail: res.mensaje || "Se actualizó con éxito."
                        });
                        this.mensajeController.resultado = res;
                        this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                    } else {
                        this.messageService.add({
                            key: "bc",
                            severity: "warn",
                            summary: "Advertencia",
                            detail: res.mensaje
                        });
                    }
                }
            }
        ).catch(error => {
            console.error(error);
            this.messageService.add({
                key: "bc",
                severity: "error",
                summary: "Error",
                detail: "Se generó un error. Póngase en contacto con los administradores."
            });
            this.bloquearPag = false;
        });
    }
}

async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({
      key: "bc",
      severity: _severity,
      summary: _summary,
      detail: _detail,
      life: 1000,
    });
  }

  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this.messageService.clear();
    this.messageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }
}
