import { Component, OnInit, ViewChild } from "@angular/core";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../../util/MensajeController";
import { ConstanteAngular } from "../../../../../@theme/ConstanteAngular";
import { ConsultaAdmisionService } from "../../../../admision/consulta/servicio/consulta-admision.service";
import { UsuarioAuth } from "../../../../auth/model/usuario";
import { PersonaBuscarComponent } from "../../../../framework-comun/Persona/components/persona-buscar.component";
import { Autorizacion } from "../../model/autorizacion";
import { AutorizacionService } from "../../service/autorizacionService";

@Component({
    selector: 'ngx-autorizaciones-mantenimiento',
    templateUrl: './autorizaciones-mantenimiento.component.html'
  })

export class AutorizacionesMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;

  visible: boolean = false;
  bloquearPag: boolean;
  acciones: string = ''
  position: string = 'top'
  validarform: string = null;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: Autorizacion = new Autorizacion();
  lstEstados: SelectItem[] = [];
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  constructor(
    private messageService: MessageService,
    private consultaAdmisionService: ConsultaAdmisionService,
    private AutorizacionService: AutorizacionService
  ) {
    super();
  }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }


  ngOnDestroy(): void {
    this.dto = new Autorizacion();
    this.lstEstados = [];
  }


  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any): void {
    console.log("EDITAR MensajeController :",  msj );
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    const p1 = this.cargarComboEstados();
    this.fechaModificacion = undefined;
    Promise.all([p1]).then((resp) => {
      if (this.validarform == "NUEVO") {
        this.dto.Estado = 1;
        this.puedeEditar = false;
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
      } else if (this.validarform == "EDITAR") {
        console.log("EDITAR FILA :", rowdata);
 
        this.bloquearPag = true;
        this.AutorizacionService.ListaAutorizacion(this.dto).then((res) => {
          this.bloquearPag = false;
          this.dto = res[0];
          console.log("EDITAR this.dto :",   this.dto );
          this.puedeEditar = false;
          this.fechaModificacion = new Date();
          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        });

      } else if (this.validarform == "VER") {
        console.log("VER FILA :", rowdata);
        this.bloquearPag = true;
        this.AutorizacionService.ListaAutorizacion(this.dto).then((res) => {
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


  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  cargarComboEstados() {
      this.lstEstados = [];
      this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }


}
