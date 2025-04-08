export class tipoPaciente{

    constructor(){
    }

    TipoAdmisionId?:      number;
    TipoPacienteId?:      number;
    Codigo:               string;
    Descripcion:          string;   
    AdmDescripcion:       string;
    
    
    FechaCreacion?:       Date; 
    FechaModificacion?:   Date; 
    UsuarioCreacion:      string; 
    UsuarioModificacion:  string; 
    IpCreacion:           string; 
    IpModificacion:       string; 
    Estado?:              number;
    ESTADOdesc:           string; 
  
}
