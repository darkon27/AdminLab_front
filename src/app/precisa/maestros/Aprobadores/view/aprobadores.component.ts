import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { PersonaBuscarComponent } from '../../../framework-comun/Persona/components/persona-buscar.component';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { AprobadoresMantenimientoComponent } from '../components/aprobadores-mantenimiento.component';
import { Aprobadores } from '../model/Aprobadores';
import { AprobadoresService } from '../service/AprobadoresService';

@Component({
  selector: 'ngx-aprobadores',
  templateUrl: './aprobadores.component.html',
  styleUrls: ['./aprobadores.component.scss']
})
export class AprobadoresComponent extends ComponenteBasePrincipal   implements OnInit,UIMantenimientoController {
  @ViewChild(AprobadoresMantenimientoComponent, { static: false }) AprobadoresMantenimientoComponent: AprobadoresMantenimientoComponent;
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  
  bloquearPag: boolean;
  filtro: Aprobadores = new Aprobadores();
  editarCampo1: boolean = false;
  editarCampoAutorizador: boolean = true;
  editarCampo2: boolean = false;
  editarCampoPaciente: boolean = true;

  lstModelo: any[] = [];
  lstTipoAdmision: any[] = [];
  lstEstado: SelectItem[] = [];
  ltsExportar: MenuItem[];
  verMantPersona: boolean = false;
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string; 
  registroSeleccionado: any;
  loading: boolean;

  constructor(
    private messageService: MessageService,
    private exportarService: ExportarService,
    private personaService: PersonaService,
    private AprobadoresService: AprobadoresService,    
    private confirmationService: ConfirmationService,
    private toastrService: NbToastrService) {
    super();
  }


  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECEMPLEADO") {
      this.filtro.IdUsuario= mensage.resultado.Documento;
      this.filtro.NombreCompleto = mensage.resultado.NombreCompleto;
    }    
  }

  coreNuevo(): void {
    this.AprobadoresMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }
  coreEditar(row) {
    this.AprobadoresMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, row);
  }
  coreVer(row) {
    this.AprobadoresMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MODELO', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row);
  }


  coreBuscar(): void {
    this.bloquearPag = true;
    this.AprobadoresService.ListarAprobadores(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lstModelo = res;
      console.log("coreBuscar listado:", res);
    });
  }


  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }


  coreExportar(): void {
 /*    if (this.lstModelo == null || this.lstModelo == undefined || this.lstModelo.length == 0) {
      this.messageService.add({
        key: "bcaur",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      var col = [[
        "NRO",
        "AUTORIZADOR",
        "PACIENTE",
        "FECHA_INI",
        "FECHA_FIN",
        "OBSERVACION",
        "AplicaTitular",
        "AplicaMonto",
        "AplicaFormula",
        "Monto",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstModelo.forEach(function (e: Autorizacion) {
        contador += 1;
        let fechaInicio = new Date(e.FechaInicio);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2); let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar = [
          contador.toString(),
          fechaCreacion,
          e.Persona?.toUpperCase() || '',
          e.Paciente?.toUpperCase() || '',
          e.EstadoDesc.toString()
        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lstModelo, col, rows, "Autorizaciones.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    } */
    throw new Error('Method not implemented.');
  }


  coreSalir(): void {
    throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    const p1 = this.cargarEstados();
    Promise.all([p1]).then((resp) => {
      this.bloquearPag = false;
    });
  }




  coreInactivar(dtoInactivar) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "AutoDialog",
      accept: async () => {
        /**AUDITORIA*/
        dtoInactivar.UltimoUsuario = this.getUsuarioAuth().data[0].Documento;
        dtoInactivar.UltimaFechaModif = new Date();
        dtoInactivar.IpModificacion = this.getIp();
        dtoInactivar.Estado = 2;
        console.log("llego coreinactivar  ", dtoInactivar);
        const respInactivar = await this.AprobadoresService.MantenimientoAprobadores(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, dtoInactivar, this.getUsuarioToken());
        if (respInactivar != null) {
          if (respInactivar.success) {
            this.messageShow('success', 'success', this.getMensajeInactivo());
            this.coreBuscar();
          } else {
            this.messageShow('warn', 'Advertencia', this.getMensajeErrorinactivar());
          }
        } else {
          this.messageShow('warn', 'Advertencia', this.getMensajeErrorinactivar());
        }
      },
    });
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
  }


  cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstado.push({ label: i.Nombre, value: i.IdCodigo });
    });
  }


  verSelectorAutorizador(): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECEMPLEADO', 'BUSCAR'), 'BUSCAR ', "E");
  }


  validarEnterAutorizador(evento) {   
    if (evento.key == "Enter") {
      if (this.filtro.IdUsuario == null) {
        this.toastMensaje('Ingrese un Nro. de documento', 'warning', 3000);
      }
      else if (this.filtro.IdUsuario.trim().length <= 4) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
        this.filtro.IdUsuario = null;
      } else {
        this.getPersonaServicio(this.filtro.IdUsuario.trim(), 1);
      }
    }
  }

  limpiarAutorizador() {
    this.filtro.IdUsuario = null;
    this.filtro.NombreCompleto = null;
    this.editarCampoAutorizador = false;
  }


  getPersonaServicio(documento: any, validator: number) {
    console.log("mensaje documento", documento);
    let dto = {
      Documento: documento.trim(),
      tipopersona: "P",
      SoloBeneficiarios: "0",
      UneuNegocioId: "0"
    }

    return this.personaService.listaPersonaUsuario(dto).then((res) => {
      console.log("mensaje del res", res);
      this.bloquearPag = false;
      if (res.length > 0) {
        if (validator == 1) {
          if (this.estaVacio(res[0].NombreCompleto)) {
            this.filtro.NombreCompleto = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`
          } else {
            this.filtro.NombreCompleto = res[0].NombreCompleto;
          }
          this.filtro.IdUsuario = res[0].Documento;
         }

      } else {
        console.log("entroo nadaaa");
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        this.filtro.IdUsuario = null;
      }
    }).catch(error => error);

  }

}