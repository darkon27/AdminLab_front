export class DtoComponenteHomologacion {

    constructor() {
    }
    NombreCompleto: string;
    Descripcion: string;
    UneuNegocioId: number;
    IdEmpresa: number; 
    CodigoComponente: string;
    CodigoHomologado: string;  

    UsuarioCreacion: string;
    FechaCreacion: Date;
    UsuarioModificacion: any;
    FechaModificacion: Date;
    IpCreacion: any;
    IpModificacion: any;
    Estado: number;
    EstadoAdm: string;
}