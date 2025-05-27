export class tipoAdmision{

    constructor(){
    }

    UneuNegocioId:        number; 
    TipoAdmisionId?:      number;
    AdmCodigo:            string;   
    AdmDescripcion:       string; 
    FechaCreacion?:       Date; 
    FechaModificacion?:   Date; 
    UsuarioCreacion:      string; 
    UsuarioModificacion:  string; 
    IpCreacion:           string; 
    IpModificacion:       string; 
    AdmEstado?:           number;
    EstadoDesc:           string;
    Estado:              string;
  
}
