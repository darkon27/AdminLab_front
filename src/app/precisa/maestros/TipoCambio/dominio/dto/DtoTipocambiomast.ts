
export class DtoTipocambiomast {
    constructor() {

    }
    num: number;
    // pk
    MonedaCodigo: string
    MonedaCambioCodigo: string
    FechaCambio: string | Date
    FechaCambioString: string
    Factor: number
    FactorCompra: number
    FactorVenta: number
    FactorPromedio: number
    FactorCompraAfp: any
    FactorVentaAfp: any
    FactorCompraSBS: number
    FactorVentaSBS: number
    ValorCuota: any
    TasaTAMEX: number
    TasaTAMN: number
    TasaAnualTAMEX: number
    TasaAnualTAMN: number
    EstadoDesc: string
    Estado: string
    UltimaFechaModif: Date | string
    UltimoUsuario: string
    FactorCobranza: any
    FactorCobranzaVenta: number
    DesMoneda: string
    DesCambio: string

    UsuarioCreacion: string;
    FechaCreacion: Date;
    // columnas

}
