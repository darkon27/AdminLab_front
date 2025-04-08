export class dtoProduccion{

    constructor(){
        
    }
    Id:                 number;
    FechaProduccion:    Date;
    IdOALineaOrigen:    number;
    IdAdmision:         number;
    Persona:            number;
    Cantidad:           number;
    Monto:              number;
    MontoTotal:         number;
    Copago:             number;
    Estado:             number;
    TipoOperacionId:    number;
    CoaSeguro:          number;
    TipoAdmisionId:     number;
    TipoPacienteId:     number;
    IdSede:             number;
    IdAseguradora:      number;
    IdEmpresaPaciente:  number;
    IdPaciente:         number;
    IdClasificacion:    number;
    UneuNegocioId:      number;
    IdAdmServicio:      number;

    Periodo:            string;
    UnidadNegocio:      string;
    ClasificadorMovimiento: string;
    RUC:                string;
    CLIENTE:            string;
    TipoPaciente:       string;
    NroPeticion:        string;
    CodigoComponente:   string;
    Nombre:             string;
    NombreCompleto:     string;
    Documento:          string;
    EmpresaPaciente:    string;
    RucEmpresa:         string;
    DesEstado:          string;
    UsuarioCreacion?:   string;

}