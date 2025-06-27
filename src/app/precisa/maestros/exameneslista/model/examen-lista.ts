export class ExamenListaBase {
    constructor() {
    }

    // Propiedades principales
    IdListaBase: number;
    Nombre: string;
    TipoComponente: string;
    CODIGOCOMPONENTE: string;
    DESCRIPCION: string;
    Periodo: number;
    Moneda: string;
    
    // Propiedades de precios
    PrecioUnitarioLista?: number;
    Valor?: number;
    PrecioUnitarioListaLocal?: number;
    PrecioUnitarioBase?: number;
    PrecioUnitarioBaseLocal?: number;
    
    // Fechas de validez
    FechaValidezInicio?: Date;
    FechaValidezFin?: Date;
    
    // Estado y clasificación
    Estado?: number;
    IdClasificacion?: number;
    ESTADOdesc: string;
    
    // Factores y precios especiales
    TipoFactor: string;
    Factor?: number;
    IndicadorFactor?: number;
    IndicadorPrecioCero?: number;
    FactorCosto?: number;
    PrecioCosto?: number;
    PrecioKairos?: number;
    FactorKairos?: number;
    
    // Auditoría
    UsuarioCreacion: string;
    FechaCreacion?: Date;
    UsuarioModificacion: string;
    FechaModificacion?: Date;
}