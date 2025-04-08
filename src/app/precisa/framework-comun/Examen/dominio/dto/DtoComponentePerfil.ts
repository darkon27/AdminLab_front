
export class DtoComponentePerfil {

    constructor() {
    }
  
    UneuNegocioId: number; 
    CodigoComponente: string;
    CodigoHomologado: string;
    DesHomologacion: string;
    Descripcion: string;

    UsuarioCreacion: string;
    FechaCreacion: Date;
    UsuarioModificacion: any;
    FechaModificacion: Date;
    IpCreacion: any;
    IpModificacion: any;
    Cantidad: number;
    Estado: number;
    EstadoAdm: string;
}
