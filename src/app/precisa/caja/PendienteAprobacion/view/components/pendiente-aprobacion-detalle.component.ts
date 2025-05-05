import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { MessageService } from "primeng/api";
import Swal from "sweetalert2";
import { ComponenteBasePrincipal } from "../../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../../util/UIMantenimientoController";
import { ConsultaDetalleAdmision } from "../../../../admision/consulta/dominio/dto/DtoConsultaAdmision";
import { FiltroConsultaAdmision } from "../../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision";
import { ConsultaAdmisionService } from "../../../../admision/consulta/servicio/consulta-admision.service";
import { LoginService } from "../../../../auth/service/login.service";
import { PersonaService } from "../../../../framework-comun/Persona/servicio/persona.service";
import { ComprobanteService } from "../../../../liquidacion/facturacion/service/Comprobante.services";
import { dtoExpediente } from "../../../../liquidacion/liquidacion_form/model/dtoExpediente";
import { ExpedienteModal } from "../../../../liquidacion/liquidacion_form/model/ExpedienteModal";
import { LiquidacionService } from "../../../../liquidacion/liquidacion_form/service/liquidacion.services";


@Component({
    selector: 'ngx-pendiente-aprobacion-detalle',
    templateUrl: './pendiente-aprobacion-detalle.component.html'
  })

export class PendienteAprobacionDetalleComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController {
  bloquearPag:  boolean;
  editarCampos: boolean;
  verConsultaDetalle: boolean = false;
  acciones: string = ''
  position: string = 'top'
  titulo: string;
  Auth = this.getUsuarioAuth().data;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  filtro: ConsultaDetalleAdmision = new ConsultaDetalleAdmision();
  lstListarDet: ConsultaDetalleAdmision[] = [];
  dtoExpediente: dtoExpediente = new dtoExpediente();
  modal : ExpedienteModal = new ExpedienteModal();
  lastYearTotal: number;
  cantidad: number = 0;
  temFlagAdelanto: number;
  temFlagCortesia: number;



  constructor(
    private messageService: MessageService,
    private toastrService: NbToastrService,
    public loginService: LoginService,
    private LiquidacionService: LiquidacionService,
    private ComprobanteService: ComprobanteService,    
    private consultaAdmisionService: ConsultaAdmisionService,
    private personaService: PersonaService
    ) {
    super();
  } 
  btnEliminar?: boolean;
  coreEliminar(): void {
    throw new Error("Method not implemented.");
  }


  ngOnDestroy(): void {
    this.filtro = new ConsultaDetalleAdmision();
  }

  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }

  coreBuscar(): void {    
    throw new Error('Method not implemented.');
  }

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreExportar(): void {
    throw new Error('Method not implemented.');
  }

  coreSalir(): void {
    //console.log("coreSalir ::",  this.mensajeController );
    this.editarCampos = false;
    this.verConsultaDetalle = false;
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    Promise.all([]).then(
      f => {
        setTimeout(() => {
          this.bloquearPag = false;
        }, 100);
      });
  }  
      
  coreIniciarComponenteDetalle(mensaje: MensajeController, accionform: string, dtoConsultaDet?: any): void 
  {
    this.editarCampos= true;
    this.verConsultaDetalle = true;
    if (accionform == "DETALLE") 
    {
        this.mensajeController = mensaje;
        //console.log("1 :: DETALLE ENTRO coreIniciarComponenteDetalle", this.mensajeController);
        this.titulo = 'DETALLE DE ADMISION';
        this.acciones = this.titulo + ":" + accionform;
        dtoConsultaDet.IdAdmision = this.mensajeController.componenteDestino.seleccion.IdAdmision;
        this.dtoExpediente = this.mensajeController.componenteDestino.seleccion;
        this.temFlagAdelanto = this.mensajeController.componenteDestino.seleccion.FlagAdelanto;
        this.temFlagCortesia = this.mensajeController.componenteDestino.seleccion.FlagCortesia;
        //console.log("dtoExpediente  ::", this.dtoExpediente);
        this.ListadoAdmisionConstancia(dtoConsultaDet);
    }
  }

  ListadoAdmisionConstancia(detalleconsulta: FiltroConsultaAdmision) {
    //console.log("2 :: DETALLE ENTRO ListadoAdmisionConstancia", detalleconsulta);
    this.bloquearPag = true;
    return this.consultaAdmisionService.ListadoConstancia(detalleconsulta).then(res => {
  
      this.bloquearPag = false;
      if (res.length > 0) 
      {
        this.filtro = res[0]; 
        //console.log("3 :: ListadoConstancia ::",this.filtro);
        var contado = 1;
        var total = 0;
        var cantidadExamenes = 0;

        res.forEach(element => {   
          element.FlagAdelanto = this.mensajeController.componenteDestino.seleccion.FlagAdelanto;
          element.FlagCortesia = this.mensajeController.componenteDestino.seleccion.FlagCortesia;
          element.numeroXadmision = contado++;
          cantidadExamenes += element.Cantidad;
          var ExamenConIgv = element.Precio * this.getUsuarioAuth().data[0].Igv;
          total += (element.Precio + ExamenConIgv) * element.Cantidad;
          element.igvprecioexamenes = element.Precio + ExamenConIgv;
        });

        this.lstListarDet  = res;
        //console.log(" this.lstListarDet :: ",  this.lstListarDet);
        this.cantidad = cantidadExamenes;
        this.lastYearTotal = total;    
      }
    });
  }

  coreAnular(): void {
    this.verConsultaDetalle = false;
    Swal.fire({
      title: '¡Importante!',
      text: "¿Seguro que desea Anular el registro? :: " +  this.filtro.NroPeticion,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#094d74',
      cancelButtonColor: '#ffc72f',
      cancelButtonText: 'No, Cancelar!',
      confirmButtonText: 'Si, Anular!'
    }).then((result) => {
      if (result.isConfirmed) {  
        this.bloquearPag = true;
        this.ServicioAnulacion();
        this.toastMensaje('Se Anulo el registro con éxito. nro Preticion :: ' +  this.filtro.NroPeticion, 'success', 2000);
        this.bloquearPag = false;
      }else{
        this.verConsultaDetalle = true;
      }
    })
  }

  coreGuardar(): void {
    this.verConsultaDetalle = false;
    Swal.fire({
      title: '¡Importante!',
      text: "¿Seguro que desea Aprobar el registro? :: " +  this.filtro.NroPeticion,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#094d74',
      cancelButtonColor: '#ffc72f',
      cancelButtonText: 'No, Cancelar!',
      confirmButtonText: 'Si, Aprobar!'
    }).then((result) => {
      if (result.isConfirmed) {                
      
        this.bloquearPag = true;
        this.ServicioRegistrar();
        this.toastMensaje('Se ha Aprobar el registro con éxito. nro Preticion :: ' +  this.filtro.NroPeticion, 'success', 2000);
        this.bloquearPag = false;
      }else{
        this.verConsultaDetalle = true;
      }
    })
  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
      this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  makeToast(title: string) {
      this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }


  ServicioAnulacion() {
    var hoy = new Date();
    this.dtoExpediente.Estado = 4;
    this.dtoExpediente.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
    this.dtoExpediente.UsuarioModificacion =  this.getUsuarioAuth().data[0].Usuario;
    this.modal = new ExpedienteModal();
    this.modal.cabecera = this.dtoExpediente;

    this.LiquidacionService.MantenimientoExpediente(3, this.modal, this.getUsuarioToken()).then(
      res => {
        //console.log("res guardado:", res);
        if (res.success) {
          this.makeToast(this.getMensajeGrabado(this.modal.cabecera.CodigoExpediente));
          this.verConsultaDetalle = false;
          //console.log("entro:",this.mensajeController.resultado)
          let dtoAdmision = {
            IdAdmision: this.filtro.IdAdmision,
            Estado: 3,
            IpModificacion: this.getIp(),
            NroPeticion: this.filtro.NroPeticion,      
            UsuarioModificacion: this.getUsuarioAuth().data[0].Usuario,
          }
          
          this.consultaAdmisionService.MantenimientoAdmision(3, dtoAdmision, this.getUsuarioToken()).then(
            trres => {         
              //console.log("MantenimientoTransaccion  ::",  trres.success);
            })    
          this.mensajeController.resultado = res;
          //console.log("res enviando:", res);
          this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        }
        else {
          this.verConsultaDetalle = false;
          var mensajito;
          var confirmar;
          var cerrar;
          var validar = 0
          if (this.estaVacio(res.mensaje)) {
            mensajito = 'El token a expirado.'
            confirmar = 'Continuar con el registro'
            cerrar = 'Cerrar sesión'
            validar = 1
          } else {
            mensajito = res.mensaje;
            confirmar = 'Volver al registro'
            cerrar = 'Cerrar'
            validar = 2
          }
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: mensajito,
            showCancelButton: true,
            confirmButtonColor: '#094d74',
            cancelButtonColor: '#ffc72f',
            cancelButtonText: cerrar,
            confirmButtonText: confirmar
          }).then((result) => {
            if (result.isConfirmed) {
              this.verConsultaDetalle = true;
              if (validar == 1) {
                this.nuevoToken(this.loginService)
              }
            } else {
              if (validar == 1) {
                sessionStorage.removeItem('access_user')
                sessionStorage.removeItem('access_user_token')
                sessionStorage.removeItem('access_menu')
               // this.router.navigate(['/auth/login']); 
              }

            }
          })
        }
      }).catch(error => error);
  }

  ServicioRegistrar() {
    var hoy = new Date();
    this.dtoExpediente.TipoExpediente = 4; 
    this.dtoExpediente.FechaFinal = new Date(hoy);
    this.dtoExpediente.Estado = 6;
    this.dtoExpediente.TipoAdmisionId = 3
    this.dtoExpediente.FechaAprobacion = new Date(hoy);
    this.dtoExpediente.Descripcion = "LIQUIDACION PENDIENTE DE CIERRE PARTICULAR GRATUITA CON NRO ATENCION " + this.dtoExpediente.NroPeticion;
    this.dtoExpediente.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
    this.dtoExpediente.UsuarioModificacion =  this.getUsuarioAuth().data[0].Usuario;
    this.modal = new ExpedienteModal();
    this.modal.cabecera = this.dtoExpediente;

    this.LiquidacionService.MantenimientoExpediente(2, this.modal, this.getUsuarioToken()).then(
      res => {
        //console.log("res guardado:", res);
        if (res.success) {
          this.makeToast(this.getMensajeGrabado(this.modal.cabecera.CodigoExpediente));
          this.verConsultaDetalle = false;
          //console.log("entro:",this.mensajeController.resultado)
          let dtoTransaccion = {
            IdAdmision: this.filtro.IdAdmision,
            IdClienteFacturacion: 0,
            ClasificadorMovimiento: this.filtro.ClasificadorMovimiento,
            NroPeticion: this.filtro.NroPeticion,      
            UsuarioModificacion: this.getUsuarioAuth().data[0].Usuario,
          }
          
          this.consultaAdmisionService.MantenimientoTransaccion(1, dtoTransaccion, this.getUsuarioToken()).then(
            trres => {         
              //console.log("MantenimientoTransaccion  ::",  trres.success);
            })

            let dtoHomologacionCliente = {
              IdPersona: this.filtro.Persona,
              Documento: this.filtro.Documento,
              ClasificadorMovimiento: this.filtro.ClasificadorMovimiento,
              NroPeticion: this.filtro.NroPeticion,      
              UsuarioCreacion: this.getUsuarioAuth().data[0].Usuario,
            }

            this.ComprobanteService.MantenimientoHomologacionCliente(1, dtoHomologacionCliente, this.getUsuarioToken()).then(
              comres => {
                //console.log("MantenimientoHomologacionCliente  ::",  comres.success);
              })

            

          this.mensajeController.resultado = res;
          //console.log("res enviando:", res);
          this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        }
        else {
          this.verConsultaDetalle = false;
          var mensajito;
          var confirmar;
          var cerrar;
          var validar = 0
          if (this.estaVacio(res.mensaje)) {
            mensajito = 'El token a expirado.'
            confirmar = 'Continuar con el registro'
            cerrar = 'Cerrar sesión'
            validar = 1
          } else {
            mensajito = res.mensaje;
            confirmar = 'Volver al registro'
            cerrar = 'Cerrar'
            validar = 2
          }
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: mensajito,
            showCancelButton: true,
            confirmButtonColor: '#094d74',
            cancelButtonColor: '#ffc72f',
            cancelButtonText: cerrar,
            confirmButtonText: confirmar
          }).then((result) => {
            if (result.isConfirmed) {
              this.verConsultaDetalle = true;
              if (validar == 1) {
                this.nuevoToken(this.loginService)
              }
            } else {
              if (validar == 1) {
                sessionStorage.removeItem('access_user')
                sessionStorage.removeItem('access_user_token')
                sessionStorage.removeItem('access_menu')
               // this.router.navigate(['/auth/login']); 
              }

            }
          })
        }
      }).catch(error => error);
  }


}