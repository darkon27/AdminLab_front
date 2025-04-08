import { DtoAdmisionclinicaDetalle } from "./DtoAdmisionclinicaDetalle";


export class DtoAdmisionprueba {

    // constructor() {
    //     this.IndicadorWS = null;
    //     this.Admision=new DtoPacienteClinica;
    //     this.list_AdmisionServicio=[];
    // }
    IndicadorWS:number;
    Admision:DtoPacienteClinica = new DtoPacienteClinica();
    list_AdmisionServicio:DtoAdmisionclinicaDetalle[] = []; 
}


export class DtoPacienteClinica {
    constructor() {
       // this.list_AdmisionServicio=[];
    }

    MosEstado: number;
    OrdenSinapa: string;
    EstadoAdm: string;
    Valor: number;
    valorBruto:number; //se agrega esta variable fantasma para el calculo de convenio (IGV)
    Cantidad: number;
    Descripcion: string;
    IdAdmServicio: number;
    nombres: string;

    TipoOperacionID: number;
    IdCliente: number;

    FlatAprobacion: number;
    DesEstado: string;
   
    Persona: number;
    IdAdmision: number;
    NroPeticion: string;
    numeroXadmision: number;
    CodigoComponente: string;
    ValorEmpresa: number;
    nrocorrBuscarOA:number;

    IdOrdenAtencion:number;
    Linea:number;
    Acceso:string;
    Servicio:string;
    Sucursal:string;
    CodigoHC:string;
    CodigoOA:string;
    TipoAtencion:number;
    TipoOrden:string;
    Cama:string;

    TipoDocumento:string;
    Documento: string;
    PacienteNombres:string;
    PacienteAPPaterno:string;
    PacienteAPMaterno:string;    
    NombreCompleto:string;
    Sexo:string;
    PacienteTelefono:number;
    Pacienteemail:string;
    Edad:number;
    Comentario:string;
    consentimiento:string;

    CorreoElectronico:string;
    fechanacimiento:Date;
    apellidopaterno:string;
    apellidomaterno:string;
    sexo:string;
    Telefono:string


    Componente:string;
    ComponenteNombre:string;
    CantidadSolicitada:number;

    MedicoId: number;
    MedicoNombres:string;
    MedicoAPPaterno:string;
    MedicoAPMaterno:string;
    CMP:string;
    MedicoBusqueda:string;

    Especialidad_Nombre:string;
    IdEspecialidad: number; 

    Aseguradora_RUC:string;
    Aseguradora_Nombre:string;
    IdAseguradora: number;

    Empleadora_RUC:string;
    Empleadora_Nombre:string;
    IdEmpresaPaciente: number;

    IdSedeEmpresa:number;
    SedeEmpresa: string;

    FechaLimiteAtencion:Date;
    Observacion:string;
    Mensaje:string;
    Estado:number;
    UsuarioCreacion:string;
    UsuarioModificacion:string;
    FechaCreacion:Date;
    FechaModificacion:Date;
    IpCreacion:string;
    EstadoDocumento:number;
    SituacionInterfase:number;
    GrupoInterfase:number;
    FechaLimite:Date;


   // list_AdmisionServicio:DtoAdmisionclinicaDetalle[];

   // IndicadorWS:number=1;
  //COLUNA DTO

  UneuNegocioId:number;
  TipoOperacionId:number;
  FechaAdmision:Date;
  HistoriaClinica:string;
  OrdenAtencion:string;
  IdSede:number;
  IpModificacion:string;
  TipoOrdenAtencion:number;
  RucEmpresaPaciente:string;
  EmpresaPaciente:string;
  RucAseguradora:string;
  NombreAseguradora:string;
  DesEspecialidad:string;
 
  dniMedico:string;
  NombreMedico:string;
  PaternoMedico:string;
  MaternoMedico:string;
  TIPOADMISIONID:number;
  ClasificadorMovimiento:string;
  TipoPaciente:number;
  ObservacionAlta :string;

    //Particular

    ValorDescuento:number;
    FlatSeguro:number;
    FlatCoaSeguro:number;
    FlatMovilidad:number;
    Afecto:number;
    Igv:number;
    Total:number;
    Anticipo:number;
    Saldo:number;
    Redondeo:number;

}