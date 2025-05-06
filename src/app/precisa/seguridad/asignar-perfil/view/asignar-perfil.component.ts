import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { AppSatate } from '../../app.reducer';
import * as actions from '../../perfi-usuarios/store/actions'
import { AsignarPerfilService } from '../service/asignar-perfil.service';
import { forkJoin } from 'rxjs';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';

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
  lstComboPerfiles: SelectItem[] = []
  lstPerfiles: any[] = [];

  constructor(private store: Store<AppSatate>,
    private _AsignarPerfilService: AsignarPerfilService,

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
    throw new Error('Method not implemented.');
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
    forkJoin({
      perfiles: this._AsignarPerfilService.listarComboPerfil({ ESTADO: "A" }),
    }
    ).subscribe(resp => {

      const dataPerfiles = resp.perfiles?.map((ele: any) => ({
        label: ele.Descripcion?.trim()?.toUpperCase() || "", value: `${ele.Codigo?.trim() || ""}00`
      }));
      this.lstComboPerfiles = [optTodos, ...dataPerfiles];

    });
  }

}
