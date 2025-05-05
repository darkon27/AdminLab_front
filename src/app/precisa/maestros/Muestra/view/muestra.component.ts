import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { MuestrasMantenimientoComponent } from './components/muestra-mantenimiento.component';
import { MuestraModel } from '../model/Muestra';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { MuestraService } from '../service/MuestraService';

@Component({
  selector: 'ngx-muestra',
  templateUrl: './muestra.component.html',
  styleUrls: ['./muestra.component.scss']
})
export class MuestraComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(MuestrasMantenimientoComponent, { static: false }) muestraMantenimientoComponent: MuestrasMantenimientoComponent;
  bloquearPag: boolean;
  filtro: MuestraModel = new MuestraModel();
  lstEstado: any[] = [];
  lstMuestra: any[] = [];
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string; 
  registroSeleccionado: any;
  loading: boolean;

  constructor(private MuestraService: MuestraService) {super(); }
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error('Method not implemented.');
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }
  

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    this.cargarFuncionesIniciales();
  }

  async cargarFuncionesIniciales() {

    await this.cargarEstados();
    // await this.comboCargarTipoAdmision();    
  }

  coreNuevo(): void {
    this.openNew();
  }

  coreEditar(row) {
    this.muestraMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, row);
  }

  coreVer(row) {
    this.muestraMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row);
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


  openNew() {
    this.muestraMantenimientoComponent.iniciarComponente('NUEVO',this.objetoTitulo.menuSeguridad.titulo)
  }
}
