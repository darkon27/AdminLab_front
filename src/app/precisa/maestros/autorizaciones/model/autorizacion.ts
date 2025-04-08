export class Autorizacion{

    constructor(){
    }

    num:                number;
    UneuNegocioId?:     number;
    IdAutorizacion?:    number;
    IdPaciente?:        number;
    IdEmpresa?:         number;
    IdTitularAutorizado?:   number;
    FechaInicio?:       Date; 
    FechaFin?:          Date; 

    AplicaTitular?:     number;
    AplicaMonto?:       number;
    AplicaFormula?:     number;
    Monto?:             number;
    Persona:            string;
    DocAutorizador:     string;
    Paciente:           string; 
    DocPaciente:        string; 
    Observacion:        string; 
    Descripcion:        string; 
  
    FechaCreacion?:     Date; 
    FechaModificacion?: Date; 
    UsuarioCreacion:    string; 
    UsuarioModificacion:string; 
    IpCreacion:         string; 
    IpModificacion:     string; 
    Estado?:            number;
    EstadoDesc:         string; 
  
}
