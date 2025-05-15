export class TipoPago {

    constructor() {
    }

    num?: number;
    Id?: number;
    IdCodigo?: number;
    Codigo: string;
    Nombre: string;
    Descripcion: string;
    Visible?: number | boolean;
    Orden?: number;
    FlagReferencia?: number | boolean;
    FlagBanco?: number | boolean;

    FechaCreacion?: Date;
    FechaModificacion?: Date;
    UsuarioCreacion: string;
    UsuarioModificacion: string;
    Estado?: number;
    EstadoDesc: string;

}
