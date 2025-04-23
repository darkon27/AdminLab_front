import { Component, OnInit } from "@angular/core";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { MaestrodetalleService } from "../../Detalle/servicio/maestrodetalle.service";
import { listabase } from "../model/listabase";
import { listabaseServices } from "../service/listabase.service";

@Component({
    selector: 'ngx-lista-base-mantenimiento',
    templateUrl: './lista-base-mantenimiento.component.html'
  })

export class ListaBaseMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  lstEstados: SelectItem[] = [];
  lstMoneda: SelectItem[] = [];
  bloquearPag:boolean;
  validarform:string = null;
  usuario:    string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  dto:        listabase = new listabase();
  filtro:     listabase = new listabase();
  acciones:   string = '';
  position:   string = 'top';

  constructor(
    private messageService: MessageService,
    private MaestrodetalleService: MaestrodetalleService,  
    private listabaseServices: listabaseServices    
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
    const p2 = this.cargarComboMoneda();
    this.dto = new listabase();
    this.fechaModificacion = undefined;
    Promise.all([p1,p2]).then((resp) => {
      if (this.validarform == "NUEVO") {
        this.dto.Estado = 1;
        this.puedeEditar = false;
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
      } else if (this.validarform == "EDITAR") {
        console.log("EDITAR FILA :", rowdata);
        this.filtro.IdListaBase = rowdata.IdListaBase;
        this.bloquearPag = true;
        this.listabaseServices.ListadoBase(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.dto = res[0];
          if (res[0].FechaValidezInicio != null) {this.dto.FechaValidezInicio = new Date(res[0].FechaValidezInicio); }
          if (res[0].FechaValidezFin != null) {this.dto.FechaValidezFin = new Date(res[0].FechaValidezFin); }
          console.log("EDITAR this.dto :",   this.dto );
          this.puedeEditar = false;
          this.fechaModificacion = new Date();
          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        });

      } else if (this.validarform == "VER") {
        console.log("VER FILA :", rowdata);
        this.filtro.IdListaBase = rowdata.IdListaBase;
        this.bloquearPag = true;
        this.listabaseServices.ListadoBase(this.filtro).then((res) => {
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

  cargarComboMoneda() {
    let dto = {  Estado: "A"  }
    this.lstMoneda = [];
    this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.MaestrodetalleService.ListarMoneda(dto).then(res => {
    console.log("cargarComboMoneda::", res);
        res.forEach(ele => {
            this.lstMoneda.push({ label: ele.DescripcionCorta.trim(), value: ele.MonedaCodigo });
        });
    });
  }

  async coreGuardar() {
    if (this.estaVacio(this.dto.Codigo)) { this.messageShow('warn', 'Advertencia', 'Ingrese un código válido'); return; }
    if (this.estaVacio(this.dto.Descripcion)) { this.messageShow('warn', 'Advertencia', 'Ingrese un nombre válido'); return; }
    if (this.estaVacio(this.dto.Estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione una estado válido'); return; }
    if (this.validarform == "NUEVO") {
      this.bloquearPag = true;
      this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();
      this.dto.FechaCreacion = this.fechaCreacion;
      this.listabaseServices.MantenimientoBase(1, this.dto, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          this.dialog = false;
          console.log("registrado:", res);
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

      this.listabaseServices.MantenimientoBase(2, this.dto, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          if (res != null) {
            console.log("registrado:", res);
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
