export class dtoCobranzadetalle{

    constructor(){
        
    }
    Compania:                       string;     
     NombreCompleto :               string;
      TipoComprobante :             string;
      FormaPagoDES :                string;
      BancoDes :                    string;
      MonedaDes :                   string;
      NumeroComprobante :           string;
      IdVendedor :                  number;
      EstComprobante :              number;
      EstCobranza :                 number;
      num:                          number;
      DescripcionCorta:             string;

      IdCobranza:                   number;
      Secuencial:                   number;
      FechaPago	:                   Date;
      FormaPago:                    number;
      Moneda	:                   string;
      TipoCambio:                   number;
      Monto:                        number;
      MontoLocal:                   number;
      Banco	:                       string;
      NumeroCheque	:               string;
      NumeroTarjeta	:               string;
      CuentaOrigen	:               string;
      CuentaDeposito	:             string;
      FlujoCaja	:                   string;
      DocumentoReferencia	:             string;
      IndicadorDeposito:            number;
      NumeroDeposito	:             string;
      FechaDeposito	:               Date;
      Recibo	:                   string;
      Arqueo:                       number;
      ArqueoDocumento	:             string;
      IndicadorDescuento:            number;
      AsientoDescuento	:             string;
      Observacion	:               string;
      Estado:                       number;
      UsuarioCreacion	:             string;
      FechaCreacion	:               Date;
      UsuarioModificacion	:             string;
      FechaModificacion	:           Date;
      IdComprobante:                number;
      ArqueoAnulado:                number;
      LoteTarjeta	:               string;
      TerminalTarjeta	:             string;
      ReferenciaTarjeta	:             string;
      MontoRecibido:                number;
      MontoRecibidoLocal:            number;
      IdConciliacion:               number;
      PorcentajeRetencion:            number;
      MontoRetencion:               number;
      MontoRetencionLocal:            number;
      MontoIGV:                     number;
      Situacion:                    number;
      ConciliacionAnulado:          number;
      ConciliacionDocumento	:       string;
      PeriodoPDT:                   number;
      UnidadReplicacionTransaccion	:             string;
      NumeroTransaccion:            number;
      SecuenciaTransaccion:            number;
      MontoAbono:                   number;
      MontoAbonoLocal:              number;
      ArqueoBackup:                 number;
}