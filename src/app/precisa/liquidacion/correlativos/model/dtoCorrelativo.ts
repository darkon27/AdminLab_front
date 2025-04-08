export class dtoCorrelativo{
    constructor(){
        
    }
    CompaniaCodigo?: string;
    TipoComprobante?: string;
    Serie?: string;
    Descripcion?: string;
    CorrelativoNumero?: number | null;
    CorrelativoDesde?: number | null;
    CorrelativoHasta?: number | null;
    AlmacenCodigo?: string;
    Estado?: string;
    UltimoUsuario?: string;
    UltimaFechaModif?: Date | null;
    Sucursal?: string;
    IdEstablecimiento?: number | null;
    UsuarioCreacion?: string;
    FechaCreacion?: Date | null;
    ObjetoReporte?: string;
    Impresora?: string;
    IndicadorImpresora?: number | null;
    Lineas?: number | null;
    NumeroDigitos?: number | null;
    IndicadorTicket?: number | null;
    idCaja?: number | null;
    IndicadorIncluirFacturacion?: number | null;
    ImpresoraFlag?: string;
    DatawindowObjeto?: string;
    Ancho?: number | null;
    Alto?: number | null;
    ESTADOdesc?: string;
    DescripcionCorta?: string;
    SedDescripcion?: string;
    IdEmpresa?: number | null;
    IdSede?: number | null;
}