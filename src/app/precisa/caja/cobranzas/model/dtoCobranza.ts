export class dtoCobranza{

    constructor(){
        
    }
      IdComprobante:                number;
      TipoComprobante :             string;
      SerieComprobante :            string;
      Numero :                      string;
      NumeroComprobante :           string;
      NombreCliente :               string;
      DocumentoCliente :            string;
      IdClienteFacturacion :        number;
      ClasificadorMovimiento :       string;
      EstFac :                      string;
      SedDescripcion :              string;
      TipoFacturacion :             string;
      RazonSocial:                  string;
      Ruc:                          string;
      EstadoEnvioElectronico :      number;
      CodigoHashElectronico:        string;
      EstadoSunatElectronico:       number;
      IdCobranza :                  number;
      TipoCobranza:                 string;
      SerieCobranza:                string;
      PeriodoEmision:               number;
      NumeroCobranza:               string;
      IdEjecutivoCobranza:          number;
      IdVendedor:             number;
      Compania:             string;
      Sucursal:             string;
      IdEstablecimiento:            number;
      NumeroCaja:             string;
      Cajero:             string;
      IdCliente:             number;
      Observacion:             string;
      IdDocumento:             number;
      IdTipoActividad:             number;
      IdHojaTrabajo:             number;
      TipoVenta:             number;
      FechaIngreso :                Date;
      FechaPago :            Date;
      FechaAnulacion :            Date;
      NumeroDeposito:             string;
      IndicadorContabilizado:       number;
      PeriodoAsiento:             number;
      Asiento :                 string;
      Banco :                   string;
      Moneda :                  string;
      TipoCambio:               number;
      Monto:                    number;
      Saldo:                    number;
      MontoLocal:                   number;
      SaldoLocal:                   number;
      Estado:                       number;
      FechaCreacion :               Date;
      FechaModificacion :           Date;
      UsuarioCreacion :             string;
      UsuarioModificacion :         string;
      EstadoDocumento:             number;
      EstadoDocumentoAnterior:      number;
      AjusteMonto:                  number;
      IdPLanillaBanco:              number;
      FechaAsiento :                Date;
      FechaAsientoAnulado :         Date;

      PeriodoAsientoAnulado:        number;
      IndicadorAnulado:             number;
      IdPersonaAntUnificacion:      number;
      NumeroTransaccion:             number;
      SecuenciaTransaccion:         number;
      IdEmpresaAnteriorUnificacion: number;
      IndicadorContabilizado_bk:    number;
      Periodoasiento_bk:            number;
      PersonaAntUnificacion:        number;
      IdAdmision:                   number;

      AsientoAnulado :             string;
      UnidadReplicacionTransaccion :    string;
      TipoCobranzaBack :            string;
      asiento_bk :                  string;
      UnidadReplicacion :             string;
      DesEstado :                   string;
      FechaCobranza :             string;
      num:                          number;

      MontoAfecto:              number;
      FechaAdmision:            Date;
      IdSede:                   number;
      TipoMedioPago:            number;

      FechaEmision :            Date;
      FechaVencimiento :        Date;
      CorreoElectronico:        string;
      MontoTotal:               number;
      IGV:                      number;
      Monedadet :               string;
      fechanacimiento :         Date;
      sexo:                     string;

      CalAfecto:      any;
      CalExon:        any;
      CalIGV:         any;
      CalTotal:       any;
}