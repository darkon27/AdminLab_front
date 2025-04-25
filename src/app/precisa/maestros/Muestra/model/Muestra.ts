export class MuestraModel{

    constructor(){
    }
    IdMuestra:        number;
    Nombre:          string;
    Observacion:    string;
    Cantidad:      number;
    Estado?:        number;
    FechaCreacion?: Date;
    FechaModificacion?: Date;
    UsuarioCreacion: string;
    UsuarioModificacion: string;
    IpCreacion: string;
    IpModificacion: string;
    abreviatura?: string;
    Empresa: string;
    FlgTipoEntrada: number;
    IdMuestraRec: number;
    TipoMuestra?: string;
    TipoSangre?: string;
}
