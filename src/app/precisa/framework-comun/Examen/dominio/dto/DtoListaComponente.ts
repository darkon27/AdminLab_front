export class DtoListaComponente {

    constructor() {
    }
  
    IdListaBase: number; 
    Nombre: string;
    TipoComponente: string;
    CODIGOCOMPONENTE: string;
    DESCRIPCION: string;
    Periodo: number; 
    Moneda: string;
    PrecioUnitarioLista: number; 
    Valor: number; 
    PrecioUnitarioListaLocal: number; 
    PrecioUnitarioBase: number; 
    PrecioUnitarioBaseLocal: number; 
    FechaValidezInicio: Date;
    FechaValidezFin: Date;

    TipoFactor: string; 
    Factor: number; 
    IndicadorFactor: number; 
    IndicadorPrecioCero: number; 
    FactorCosto: number; 
    PrecioCosto: number; 
    PrecioKairos: number; 
    FactorKairos: number; 

    UsuarioCreacion: string;
    FechaCreacion: Date;
    UsuarioModificacion: any;
    FechaModificacion: Date;
    Estado: number;
    ESTADOdesc: string;


}
