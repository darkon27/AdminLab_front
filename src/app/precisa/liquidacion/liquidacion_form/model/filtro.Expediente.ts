export class filtroExpediente{

    constructor(){
        
    }
    UneuNegocioId?:          number;
    IdExpediente?:           number;
    CodigoExpediente:       string;
    ClasificadorMovimiento:  string;
    TipoExpediente?:         number;    
    FechaInicio:             Date;
    FechaFinal:              Date;
    Estado:                  number;
    TipoAdmisionId?:         number;
    IdClienteFacturacion?:   number;
    IdContrato?:             number;

    NroPeticion:            string;
    Persona?:               number;
    Descripcion:            string;
    IdSede?:                number;
    OrdenAtencion:          string;
    HistoriaClinica:        string;
    EstadoAdm:              string;

    NombreCompleto:         string;
    DocumentoFiscal:        string;
    TipoDocumento:          string;

    DocumentoAprobador:     string;
    NombreAprobador:        string;
    TipoPaciente?:          number;
}