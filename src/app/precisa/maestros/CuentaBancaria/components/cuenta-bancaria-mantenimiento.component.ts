import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MessageService, SelectItem } from "primeng/api";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";
import { forkJoin } from "rxjs";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { CuentaBancaria } from "../model/Cuenta-Bancaria";
import { CuentaBancariaService } from "../services/cuenta-bancaria.service";

@Component({
    selector: 'ngx-cuenta-bancaria-mantenimiento',
    templateUrl: './cuenta-bancaria-mantenimiento.component.html'
  })
export class CuentaBancariaMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
 
  titulo: string = ''
    accionRealizar: string = ''
    position: string = 'top'
    bloquearPag: boolean;
    visible: boolean;
    usuario: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
  
    lstEstado: SelectItem[] = [];
    dto: CuentaBancaria = new CuentaBancaria();

  
  constructor(
      private _MessageService: MessageService,
      private _CuentaBancariaService: CuentaBancariaService,
  
  
    ) {
      super();
    }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  
  acciones: string = ''

  iniciarComponente(accion: string,titulo) {
    // if (accion == "NUEVO") {
      this.cargarAcciones(accion,titulo)

    
    // else{
    //   this.cargarAcciones(accion,titulo)
    // }
    
  }

  
  cargarAcciones(accion: string,titulo) {
    this.acciones = `${titulo}: ${accion}`;
   
      this.dialog = true;
      this.puedeEditar = false;
    
  }

  async coreGuardar() {
      try {
  
        if (this.estaVacio(this.dto.Descripcion)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'ingrese una descripción válida'); return; }
        if (this.estaVacio(this.dto.Estado)) { this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Seleccione una estado válido'); return; }
  
        let valorAccionServicio: number = this.accionRealizar == ConstanteUI.ACCION_SOLICITADA_NUEVO ? 1 : 2;
        this.bloquearPag = true;
  
        const consultaRepsonse = await this._CuentaBancariaService.mantenimientoCuentaBancaria(valorAccionServicio, this.dto, this.getUsuarioToken());
        if (consultaRepsonse.success == true) {
          this.MensajeToastComun('notification', 'success', 'Correcto', consultaRepsonse.mensaje);
  
          this.mensajeController.resultado = consultaRepsonse;
          this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
          this.dialog = false;
  
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
    }

  MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
    this._MessageService.clear();
    this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
  }

}


