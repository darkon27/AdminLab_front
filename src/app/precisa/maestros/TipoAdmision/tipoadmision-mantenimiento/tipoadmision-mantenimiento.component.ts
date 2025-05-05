import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { tipoAdmision } from '../model/TipoAdmision';
import { TipoAdmisionService } from '../services/TipoAdmision.services';

@Component({
  selector: 'ngx-tipoadmision-mantenimiento',
  templateUrl: './tipoadmision-mantenimiento.component.html',
  styleUrls: ['./tipoadmision-mantenimiento.component.scss']
})

export class TipoadmisionMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  lstEstados: SelectItem[] = [];
  bloquearPag: boolean;
  validarform: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  dto:  tipoAdmision = new tipoAdmision();
  filtro:  tipoAdmision = new tipoAdmision();
  acciones: string = '';
  position: string = 'top';

  constructor(
    private messageService: MessageService,
    private TipoAdmisionService: TipoAdmisionService
  ) {
    super();
  }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any): void {
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    const p1 = this.cargarEstados();
    this.dto = new tipoAdmision();
    this.fechaModificacion = undefined;
    Promise.all([p1]).then((resp) => {
      if (this.validarform == "NUEVO") {
        this.dto.AdmEstado = 1;
        this.puedeEditar = false;
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
      } else if (this.validarform == "EDITAR") {
        //console.log("EDITAR FILA :", rowdata);
        this.filtro.AdmCodigo = rowdata.AdmCodigo;
        this.bloquearPag = true;
        this.TipoAdmisionService.ListaTipoAdmision(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.dto = res[0];
          //console.log("EDITAR this.dto :",   this.dto );
          this.puedeEditar = false;
          this.fechaModificacion = new Date();
          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        });

      } else if (this.validarform == "VER") {
        //console.log("VER FILA :", rowdata);
        this.filtro.AdmCodigo = rowdata.AdmCodigo;
        this.bloquearPag = true;
        this.TipoAdmisionService.ListaTipoAdmision(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.dto = res[0];
          this.puedeEditar = true;
          if (res[0].FechaModificacion == null || res[0].FechaModificacion == undefined) {
            this.fechaModificacion = undefined;
          } else {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }
          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        });
      }
    });
  }

  cargarEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo });
    });
  }

  async coreGuardar() {
    if (this.estaVacio(this.dto.AdmCodigo)) { this.messageShow('warn', 'Advertencia', 'Ingrese un código válido'); return; }
    if (this.estaVacio(this.dto.AdmDescripcion)) { this.messageShow('warn', 'Advertencia', 'Ingrese un nombre válido'); return; }
    if (this.estaVacio(this.dto.AdmEstado)) { this.messageShow('warn', 'Advertencia', 'Seleccione una estado válido'); return; }
    if (this.validarform == "NUEVO") {
      this.bloquearPag = true;
      this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();
      this.dto.FechaCreacion = this.fechaCreacion;
      this.TipoAdmisionService.MantenimientoTipoAdmision(1, this.dto, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          this.dialog = false;
          //console.log("registrado:", res);
          if (res != null) {
            if (res.mensaje == "Created") {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Se registró con éxito.' });
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            } else {
              this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
            }
          }
        });

    } else if (this.validarform == "EDITAR") {
      this.bloquearPag = true;
      this.dialog = false;
      this.dto.FechaModificacion = this.fechaModificacion;
      this.TipoAdmisionService.MantenimientoTipoAdmision(2, this.dto, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          if (res != null) {
            //console.log("registrado:", res);
            if (res.mensaje == "Ok") {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Se actualizó con éxito.' });
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
              this.bloquearPag = false;
              this.dialog = false;
            } else {
              this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertenciaaa', detail: res.mensaje });
              this.bloquearPag = false;
              this.dialog = false;
            }
          }

        });
    }

  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }


}
