import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { FiltroCliente } from '../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision';
import { ConsultaAdmisionService } from '../../../admision/consulta/servicio/consulta-admision.service';
import { ClienteRucBuscarComponent } from '../../../framework-comun/ClienteRuc/view/clienteRuc-buscar.component';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { DtoWcoSede } from '../dominio/dto/DtoWcoSede';
import { FiltroWcoSede } from '../dominio/filtro/FiltroWcoSede';
import { MaestroSucursalService } from '../servicio/maestro-sucursal.service';

@Component({
  selector: 'ngx-sedescompartida',
  templateUrl: './sedescompartida.component.html'
})
export class SedescompartidaComponent extends ComponenteBasePrincipal implements OnInit {
  @ViewChild(ClienteRucBuscarComponent, { static: false }) clienteRucBuscarComponent: ClienteRucBuscarComponent;

  bloquearPag: boolean;
  validarform: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  dto: DtoWcoSede = new DtoWcoSede();
  acciones: string = '';
  position: string = 'top';
  lstCompania: SelectItem[] = [];
  lstCompartirSede: any[] = [];
  lstsedeCliente: SelectItem[] = [];
  filtro: FiltroWcoSede = new FiltroWcoSede();
  filtrocompa: FiltroCompaniamast = new FiltroCompaniamast();
  visible: boolean = false;

  constructor(
    private maestroSucursalService: MaestroSucursalService,
    private consultaAdmisionService: ConsultaAdmisionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    
  )  {
    super();
  }

  ngOnInit(): void {
  }

  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any): void {
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.bloquearPag = true;
    this.dto = new DtoWcoSede();
    console.log("iniciarComponenteMaestro rowdata:", rowdata);
  //  this.dto = rowdata;
    this.dto.SedCodigo = rowdata.SedCodigo;
    this.dto.SedDescripcion = rowdata.SedDescripcion;
    this.dto.IdSede = rowdata.IdSede;
    this.lstsedeCliente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });  

    this.ListaSedeCompartida();

  }
  async coreMensaje(mensage: MensajeController) {
    if (mensage.componente == "SELECCLIENTE") {
      console.log("SELECCLIENTE", mensage.resultado);
      this.dto.CodEmpresaRoe = mensage.resultado.Documento;
      this.dto.NombreCompleto = mensage.resultado.empresa;
      this.dto.IdEmpresa = mensage.resultado.Persona;
      this.combosedecliente(this.dto.IdEmpresa);
    }
  }

  ListaSedeCompartida() {

    this.lstCompartirSede = [];
    let CompartirSede = { IdSede:  this.dto.IdSede }
    console.log("ListaSedeCompartida:", CompartirSede);
    this.maestroSucursalService.ListaSedeCompartida(CompartirSede).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lstCompartirSede = res;
      console.log("lstCompartirSede:", res);
    });

  }


  limpiarClienteRuc() {
    this.dto.IdEmpresa = 0;
    this.dto.CodEmpresaRoe = "";
    this.dto.NombreCompleto = "";
    this.lstsedeCliente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });  
  }
 
  validarTeclaEnterCliente(evento) {
    if (evento.key == "Enter") {
      if (this.dto.CodEmpresaRoe == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      }
      else if (this.dto.CodEmpresaRoe.trim().length != 11) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      } else {
        var filtroClienteRuc = new FiltroCliente()
        filtroClienteRuc.UneuNegocioId = 1;
        filtroClienteRuc.TipEstado = 1;
        filtroClienteRuc.Codigo = this.dto.CodEmpresaRoe.trim();
        this.GetServiceCliente(filtroClienteRuc);
      }
    }
  }

  GetServiceCliente(filtroClienteRuc: FiltroCliente, codeExecute: boolean = false) {
    this.bloquearPag = true;
    this.consultaAdmisionService.listarcombocliente(filtroClienteRuc).then((res) => {
      this.bloquearPag = false;
      if (res.length == 0 || res == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      } else {
        this.dto.IdEmpresa = res[0].Persona;
        this.dto.CodEmpresaRoe = res[0].Documento;
        this.dto.NombreCompleto = res[0].empresa;
        this.combosedecliente( this.dto.IdEmpresa);
      }
    });
  }


  
  verSelectorCliente(): void {
    this.clienteRucBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECCLIENTE', 'BUSCAR'), 'BUSCAR');
  }

  combosedecliente(IdCliente: number): Promise<number> {
    this.lstsedeCliente = [];
    this.lstsedeCliente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });    
    var filtrosede = new FiltroWcoSede();
      filtrosede.IdEmpresa = IdCliente;
      filtrosede.SedEstado = 1;

    return this.maestroSucursalService.ListaSede(filtrosede)
      .then(resp => {
        resp.forEach(obj => this.lstsedeCliente.push({ label: obj.SedDescripcion, value: obj.IdSede }));
        console.log("ConsultaOA lista combosedecliente", this.lstsedeCliente);
        return 1;
      });
    
  }
  
  coreGuardar() {

    console.log("coreGuardar this.dto :: ", this.dto);
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea Agregar este registro ? ",
      key: "refinanciar",
      accept: () => {
        let dtoSedeCompartida = { 
          IdSede:  this.dto.IdSede,
          IdEmpresa: this.dto.IdEmpresa,
          IdSedeCompartida: this.dto.FlatCodigo
        }

        this.maestroSucursalService.MantenimientoSedeCompartida(1, dtoSedeCompartida, this.getUsuarioToken()).then(
          res => {
            if (res != null) {
              this.messageService.add({ key: 'x1bc', severity: 'success', summary: 'Success', detail: 'se Agrego con éxito.' });
              this.ListaSedeCompartida();
            }
          });
      },

    });
  }

  coreinactivar(row) {
    this.visible = true;
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea Eliminar este registro ? ",
      key: "refinanciar",
      accept: () => {
        row.SedEstado = 2;
        this.visible = false;
        this.maestroSucursalService.MantenimientoSedeCompartida(3, row, this.getUsuarioToken()).then(
          res => {
            if (res != null) {
              this.messageService.add({ key: 'x1bc', severity: 'success', summary: 'Success', detail: 'Anulado con éxito.' });
              this.ListaSedeCompartida();
            }
          });
      },
      reject: async () => {
        this.visible = false;
      }

    });
  }  

}
