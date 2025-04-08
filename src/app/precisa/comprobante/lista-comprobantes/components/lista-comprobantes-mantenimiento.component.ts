import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import {PanelModule} from 'primeng/panel';
import { SelectItem } from "primeng/api";
import { dtoComprobante } from "../../../liquidacion/facturacion/model/dtoComprobante";



@Component({
    selector: 'ngx-lista-comprobantes-mantenimiento',
    templateUrl: './lista-comprobantes-mantenimiento.component.html'
  })
export class ListaComprobantesMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
 
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  
  acciones: string = ''
  position: string = 'top'
  checked:boolean =false
  bloquearPag: boolean;
  validarform: string = null;
  PeriodoEmision: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  TipoDeCambio: number;
  disabledBanco: boolean;
  puedeEditar: boolean = false;
  puedeEditarTipoComprobante: boolean = false; 
  CambioReferencial: number;

  dto: dtoComprobante = new dtoComprobante();

  lstMoneda: SelectItem[] = [];
  lstSerie: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];
  lstTipoPago: SelectItem[] = [];
  lstLetra: SelectItem[] = [];
  lstcuentaBancaria: SelectItem[] = [];
  lstBanco: SelectItem[] = [];



  iniciarComponente(accion: string,titulo) {

    if (accion) {
      this.cargarAcciones(accion,"Registro Comprobante")
    }
  }

  
  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;
      this.dialog = true;
      this.puedeEditar = false;
    
  }



}
