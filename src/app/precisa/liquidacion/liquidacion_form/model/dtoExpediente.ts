export class dtoExpediente{

    constructor(){
        
    }
    IdExpediente:           number;
    FechaInicio?:            Date;
    FechaFinal?:             Date;
    FechaAprobacion?:       Date;
    CodigoExpediente:       string;
    Descripcion:            string;
    Moneda:                 string;
    Monto?:                  number;
    MontoLocal?:             number;
    MontoCopago?:            number;
    MontoAseguradora?:       number;
    IdAseguradora?:          number;
    IdEmpresaEmpleadora?:    number;
    TipoPaciente?:           number;
    IdPaciente?:             number;
    EstadoDocumento?:        number;
    EstadoDocumentoAnterior?:number;
    IndicadorComprobante?:   number;
    IdComprobante?:          number;
    NumeroComprobante:      string;
    Estado?:                 number;    
    UsuarioCreacion?:       string;
    UsuarioModificacion?:   string;
    FechaCreacion?:          Date;
    FechaModificacion?:      Date;
    TipoFacturacion?:        number;
    TipoAtencion?:           number;
    TipoExpediente?:         number;
    FlagReFactura?:          number;
    IdTitular?:              number;
    NombreTitular:          string;
    IdContrato?:             number;
    IdPoliza?:               number;
    IdPlan?:                 number;
    IdCobertura?:            number;
    Periodo?:                number;
    FechaFacturacion:       Date;
    IdClienteFacturacion?:   number;
    IdPacienteEmpresa?:      number;
    UneuNegocioId?:          number;
    TipoAdmisionId?:         number;
    Total?:                  number;
    Persona?:                number;
    IdSede?:                 number;
    IdClasificacion?:        number;
    IdEmpresaPaciente?:      number;
    ClasificadorMovimiento: string;
    DesTipoExpediente:      string;
    DesEstado:              string;
    NombreCompleto:         string;
    Documento:              string;
    AdmDescripcion:         string;
    Nombre:                 string;
    CodigoComponente:       string;
    NroPeticion:            string;
    num?:                    number;
}