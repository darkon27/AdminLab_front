export class MuestraModel{

    constructor(){
    }
    IdMuestra:        number;
    Nombre:          string;
    Observacion:    string;
    Cantidad:      number;
    Estado?:        number;
    ESTADOdesc:     string;
    FechaCreacion?: Date;
    FechaModificacion?: Date;
    UsuarioCreacion: string;
    UsuarioModificacion: string;
    IpCreacion: string;
    IpModificacion: string;
    abreviatura?: string;
    Empresa: string;
    FlgTipoEntrada?: number;
    FlgEntrada: string;
    IdMuestraRec: number;
    TipoMuestra?: string;
    TipoSangre?: string;
}
