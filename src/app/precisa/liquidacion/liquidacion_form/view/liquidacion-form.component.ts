import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { EmpresaBuscarComponent } from '../../../framework-comun/Empresa/view/empresa-buscar.component';
import { FiltroServicio } from '../../../framework-comun/Examen/dominio/filtro/FiltroExamen';
import { ExamenService } from '../../../framework-comun/Examen/servicio/Examen.service';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { LiquidacionFormMantenimientoComponent } from '../components/liquidacion-form-mantenimiento.component';
import { ExpedienteModal } from '../model/ExpedienteModal';
import { filtroExpediente } from '../model/filtro.Expediente';
import { LiquidacionService } from '../service/liquidacion.services';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-liquidacion-form',
  templateUrl: './liquidacion-form.component.html',
  styleUrls: ['./liquidacion-form.component.scss']
})
export class LiquidacionFormComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(LiquidacionFormMantenimientoComponent, { static: false }) liquidacionFormMantenimientoComponent: LiquidacionFormMantenimientoComponent;
  @ViewChild(EmpresaBuscarComponent, { static: false }) empresaBuscarComponent: EmpresaBuscarComponent;

  dto: Maestro[] = [];
  disableBtnGuardar: boolean;
  bloquearPag: boolean;
  editarCampos: boolean;
  editarCampoEmpresa: boolean;
  seleccion: any;
  filtro: filtroExpediente = new filtroExpediente();
  lstExpediente: any[] = [];
  lstTipoExpediente: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  lstTipoAdmision: SelectItem[] = [];
  lstClasificadorMovimiento: SelectItem[] = [];
  servicio: FiltroServicio = new FiltroServicio();

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private personaService: PersonaService,
    private LiquidacionService: LiquidacionService,
    private examenService: ExamenService,
    private toastrService: NbToastrService) {
    super();
  }

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreNuevo(): void {
    this.liquidacionFormMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'NUEVALIQUIDACION', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO, ConstanteUI.ACCION_SOLICITADA_NUEVO, 0, {});
   
  }

  async coreBuscar() {
    this.bloquearPag = true;
    console.log("Expediente coreBuscar:", this.filtro);
    this.LiquidacionService.ListarExpediente(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = res.length;
      res.forEach((element) => {
        element.num = contado--;
      });
      this.lstExpediente = res;
      console.log("Expediente coreBuscar listado:", res);
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

  coreVer(dto) {
    this.liquidacionFormMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'VERLIQUIDACION', ''), ConstanteUI.ACCION_SOLICITADA_VER, ConstanteUI.ACCION_SOLICITADA_NUEVO, 0,dto);
  }

  coreEditar(dto) {
    this.liquidacionFormMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'EDITARLIQUIDACION', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, ConstanteUI.ACCION_SOLICITADA_NUEVO, 0,dto);
  }

  coreInactivar(dto) {

    if (dto.Estado == 3) {
      this.toastMensaje(`El Registro Nro. ${dto.CodigoExpediente} No puede ser Anulado`, 'success', 2000);
      return;
    } else {

      Swal.fire({
        title: '¡Mensaje!',
        text: '¡Desea Anular el Expediente: ' + dto.CodigoExpediente + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#094d74',
        cancelButtonColor: '#ffc72f',
        cancelButtonText: '¡No, Cancelar!',
        confirmButtonText: '¡Si, Anular!'
      }).then((result) => {
        if (result.isConfirmed) {
          dto.Estado = 2;
          //  this.Entity.valor=1;
          var hoy = new Date();

          /*         let ViewModalExite = {
                    success: "true",
                    valor: "1",
                    tokem: imagenEnviar.name, //name
                    mensaje: imagenEnviar.content, //binario
                    Archivo: this.file,
                    data: Archivo
                  } */

          let Entity: ExpedienteModal = new ExpedienteModal();
          // console.log("coreInactivar  dto ::",  dto);
          Entity.success = true;
          Entity.valor = 1;
          Entity.cabecera.IdExpediente = dto.IdExpediente;
          Entity.cabecera.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
          Entity.cabecera.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
          Entity.cabecera.FechaModificacion = new Date(hoy);
          console.log("coreInactivar  this.Entity ::", Entity);

          return this.LiquidacionService.MantenimientoExpediente(3, Entity, this.getUsuarioToken()).then(
            res => {
              if (res.success) {
                this.toastMensaje(`El Registro Nro. ${Entity.mensaje} fue inactivado`, 'success', 2000);
                this.dialog = false;
              } else {
                Swal.fire({
                  icon: 'warning',
                  title: 'Oops...',
                  text: `${res.message}`
                })
              }
            }
          ).catch(error => error)
        }
      })
    }
  }

  ngOnInit(): void {
    try {
      this.bloquearPag = true;
      this.tituloListadoAsignar(1, this);
      this.iniciarComponent()
      this.listaComboEstado();
      this.listaComboTipoExpediente();
      this.listaComboClasificadorMovimiento();
    } catch (error) {
      console.error('Hubo un error al iniciar componente: ERROR::' + error);
    } finally {
      this.fechaActual();
      this.bloquearPag = false;
    }
  }

  fechaActual() {
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() - 1;
    var anio = hoy.getFullYear();
    this.filtro.FechaInicio = new Date(`${anio},${mes},${dia}`);
    this.filtro.FechaFinal = new Date(hoy);
  }

  listaComboTipoExpediente() {
    this.lstTipoExpediente = [];
    this.lstTipoExpediente.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    const lstTipoExpediente: any[] = this.getMiscelaneos()?.filter(x => x.CodigoTabla == "TIPLIQ")
    this.lstTipoExpediente = [...this.lstTipoExpediente, ...lstTipoExpediente.map((item) => { return { label: item.Nombre.toLocaleUpperCase(), value: item.Codigo } })]
  }

  private listaComboEstado() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    const lstEstados: any[] = this.getMiscelaneos()?.filter(x => x.CodigoTabla == "ESTLIQ")
    this.lstEstado = [...this.lstEstado, ...lstEstados.map((item) => { return { label: item.Nombre.toLocaleUpperCase(), value: item.Codigo } })]
  }

  listaComboClasificadorMovimiento(): void {
    const auth: UsuarioAuth = this.getUsuarioAuth();

    this.servicio.Estado = 1;
    this.filtro.ClasificadorMovimiento = auth[0]?.ClasificadorMovimiento;
    this.lstClasificadorMovimiento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    this.examenService.serviciopaginado(this.servicio).then((lista) => {
      sessionStorage.setItem('access_ClasificadorMovimiento', JSON.stringify(lista));
      this.lstClasificadorMovimiento = [...this.lstClasificadorMovimiento, ...lista.map((item) => { return { label: item.Nombre.toLocaleUpperCase(), value: item.ClasificadorMovimiento } })]
    });
  }

  validarEnterEmpresa(evento) {

    if (evento.key == "Enter") {
      this.bloquearPag = true;
      if (this.filtro.DocumentoFiscal == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        setTimeout(() => {
          this.bloquearPag = false;
        }, 500);
      } else if (this.filtro.DocumentoFiscal.length == 11 || this.filtro.DocumentoFiscal == "0") {

        if (this.filtro.DocumentoFiscal == "0") {
          this.filtro.NombreCompleto = "NO DEFINIDO"
          this.filtro.DocumentoFiscal = this.filtro.DocumentoFiscal.trim();
          this.filtro.TipoDocumento = "R";
        } else {
          this.filtro.DocumentoFiscal = this.filtro.DocumentoFiscal.trim();
          this.filtro.TipoDocumento = "R";
        }

        this.personaService.listarpaginado(this.filtro).then((res) => {

          console.log("enter empresa", res);
          if (res.length > 0) {
            this.filtro.NombreCompleto = res[0].NombreCompleto;
            this.filtro.IdClienteFacturacion = res[0].Persona;
            this.editarCampoEmpresa = true;
            setTimeout(() => {
              this.bloquearPag = false;
            }, 500);
          } else {
            setTimeout(() => {
              this.bloquearPag = false;
              this.filtro.DocumentoFiscal = null;
            }, 100);
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
          }
        });
      }
      else {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        setTimeout(() => {
          this.bloquearPag = false;
          this.filtro.DocumentoFiscal == null;
        }, 500);

      }
    }
  }

  limpiarEmpresa() {
    this.filtro.IdClienteFacturacion = null;
    this.filtro.DocumentoFiscal = null;
    this.filtro.NombreCompleto = null;
    this.editarCampoEmpresa = false;
  }

  verSelectorEmpresa(): void {
    this.empresaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECEMPRESA', 'BUSCAR'), 'BUSCAR');
  }

}
