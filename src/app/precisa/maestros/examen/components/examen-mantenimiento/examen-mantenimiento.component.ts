import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../../util/ComponenteBasePrincipa';
import { ConstanteAngular } from '../../../../../@theme/ConstanteAngular';
import { FiltroServicio } from '../../../../framework-comun/Examen/dominio/filtro/FiltroExamen';
import { ExamenService } from '../../../../framework-comun/Examen/servicio/Examen.service';

@Component({
  selector: 'ngx-examen-mantenimiento-vista',
  templateUrl: './examen-mantenimiento.component.html',
  styleUrls: ['./examen-mantenimiento.component.scss']
})
export class ExamenMantenimientoComponentVista extends ComponenteBasePrincipal implements OnInit {

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  servicio: FiltroServicio = new FiltroServicio();

  acciones: string = '';
  position: string = 'top';
  lstexamen:any[]=[];
  lstClasificacion: SelectItem[] = [];
  examen:any;
  lstEstado:SelectItem[] = [];
  lstSexo:SelectItem[] = [];
  lstTiempo:SelectItem[] = [];
  lstPerfil:SelectItem[] = [];
  lstServicio: SelectItem[] = [];
  lstHomologacion:SelectItem[] = [];
  lstMuestra: SelectItem[] = [];


  constructor(
    private examenService: ExamenService) {
    super();
  }


  async iniciarComponente(accion: string, titulo,_examen:any) {
    await this.comboCargarEstado();
    await this.listaComboSexo();
    await this.listaComboTiempo();
    await this.comboCargarClasificacion();
    await this.comboCargarServicios();
    this.cargarAcciones(accion, titulo)
    this.examen={..._examen};
    console.log("iniciarComponente examen", this.examen); 
    this.examen.IdClasificacion = _examen.IdClasificacion;
    this.examen.IdUnidadMedida = _examen.IdUnidadMedida;
    this.grillaCargarDatosPerfil(this.examen.CodigoComponente);
    this.grillaCargarDatosHomologacion(this.examen.CodigoComponente);
    this.grillaCargarDatosMuestra(this.examen.CodigoComponente);

  }

  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false;
  }

  comboCargarEstado() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstado.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo });
    });
    //this.filtro.Estado = 1;
  }

  
  listaComboTiempo() {
    this.lstTiempo = [];
    this.lstTiempo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIEMPO").forEach(i => {
      this.lstTiempo.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo})
    });
    console.log("listaComboTiempo", this.lstTiempo);   
  }

  listaComboSexo() {
    this.lstSexo = [];
    this.lstSexo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos()?.filter(x => x.CodigoTabla == "SEXO").forEach(i => {
      this.lstSexo.push({ label: i.Nombre.toUpperCase(), value: i.Codigo })
    });
  }

  comboCargarClasificacion(): Promise<number>  {
    let clasificador = { Estado: 1 }
    this.lstClasificacion = [];
    this.lstClasificacion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return  this.examenService.listarclasificadorcomponente(clasificador).then(resp => {
      resp.forEach(e => {
        this.lstClasificacion.push({ label: e.Nombre.toUpperCase(), value: e.IdClasificacion});
      });
      console.log("Examen comboCargarClasificacion", this.lstClasificacion);
      return 1;
    });
 
  }


  comboCargarServicios(): Promise<number> {
    this.servicio.Estado = 1;
    this.lstServicio = []
    this.lstServicio.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.examenService.serviciopaginado(this.servicio).then(resp => {
      resp.forEach(e => {
        this.lstServicio.push({ label: e.Nombre, value: e.ClasificadorMovimiento });
      });
      return 1;
    });
  }


  grillaCargarDatosPerfil(codigoComponente: string) {
    let Perfil = { codigoComponente: codigoComponente}
    console.log("Lista Perfil", Perfil);    
    this.lstPerfil = [];
    this.examenService.ListadoComponentePerfil(Perfil).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.codigoComponente = contado++;
      });
      console.log("Lista Examen grillaCargarDatosPerfil", res);
      /* this.bloquearPag = false; */
      this.lstPerfil = res;
    });
  }


  grillaCargarDatosHomologacion(codigoComponente: string) {
    let Homologacion = { codigoComponente: codigoComponente}
    console.log("Lista Homologacion", Homologacion);    
    this.lstHomologacion = [];
    this.examenService.ListadoComponenteHomologacion(Homologacion).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.codigoComponente = contado++;
      });
      console.log("Lista Examen grillaCargarDatosHomologacion", res);
      /* this.bloquearPag = false; */
      this.lstHomologacion = res;
    });
  }

  grillaCargarDatosMuestra(codigoComponente: string) {
    let objExaMuetra = {
      Componente: codigoComponente,
      Estado: 1
    }
    console.log("Lista objExaMuetra", objExaMuetra);
     this.examenService.listadocomponentemuestra(objExaMuetra).then((resMue) => {
        var cont = 1;
        resMue.forEach(element => {
          element.numeroExamen = cont++;
        });
        this.lstMuestra = resMue;
        console.log("Lista lstmuestra", resMue);
      });
  }




}
