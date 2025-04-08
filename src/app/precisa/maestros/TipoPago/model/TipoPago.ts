export class TipoPago{

    constructor(){
    }

    num?:                 number;
    Id?:                  number;
    IdCodigo?:            number;
    Codigo:               string;   
    Nombre:               string; 
    Descripcion:          string; 
    Visible?:              number; 
    Orden?:                number; 
    FlagReferencia?:      number;
    FlagBanco?:           number;

    FechaCreacion?:       Date; 
    FechaModificacion?:   Date; 
    UsuarioCreacion:      string; 
    UsuarioModificacion:  string; 
    Estado?:              number;
    EstadoDesc:           string; 
  
}
