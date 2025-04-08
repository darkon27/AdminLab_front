export class dtoComprobante{

    constructor(){
        
    }
      IdComprobante:                number;
      TipoComprobante :             string;
      SerieComprobante :            string;
      Numero :                      string;
      PeriodoEmision :              number;
      NumeroComprobante :           string;
      NombreCliente :               string;
      ClasificadorMovimiento :       string;
      IdClienteFacturacion :        number;
      DocumentoCliente :            string;
      CampoReferencia :             string;
      FechaEmision :                Date;
      FechaCancelacion :            Date;
      FechaVencimiento :            Date;
      Procedencia :                 number;
      TipoVenta :                   number;
      Moneda :                      string;
      TipoCambio :                  number;
      ValorImpuesto :               number;
      Estado :                      number;
      FechaCreacion :               Date;
      FechaModificacion :           Date;
      UsuarioCreacion :             string;
      UsuarioModificacion :         string;
      PrecioVenta :                 number;
      MontoAfecto :                 number;
      MontoImpuestoVentas :         number;
      MontoImpuestoVentasLocal :    number;
      MontoTotal :                  number;
      ConceptoFacturacion :         number;
      DireccionCliente :            string;
      NomClasificador :             string;
      TipoImpuesto :                number;
      Descripcion :                 string;
      IGV :                         number;
      Sucursal :                    string;
      Paciente :                    string;
      Compania :                    string;
      Detraccion :                  string;
      DesEstado :                   string;
      SedDescripcion :              string;
      TipoFacturacion :             string;
      FormaPago :                   string;
      TipoPago :                    number;
      RazonSocial :                 string;
      Ruc :                         string;
      EstadoEnvioElectronico :      number;
      EstadoEnvio :                 string;
      CodigoHashElectronico :       string;
      EstadoSunatElectronico :      number;
      DescripcionEstadoSunatElectronico :           string;
      IdCorrelativoRSBV :           number;
      FechaCreaciónRSBV :           Date;
      IdCorrelativoCB :             number;
      FechaCreaciónCB :             Date;
      Image :                       string;
      EstSunar :                    string;
      ImaSunat :                    string;
      Saldo :                       number;
      MontoAdelanto :               number;
      MontoAdelantoSaldo :          number;
      MontoRedondeo :               number;
      TipoDocumentoRelacionado :    string;
      SerieDocumentoRelacionado :   string;
      DocumentoRelacionado :        string;
      IdDocumentoRelacionado :      number;
      DEPARTAMENTO :                string;
      PROVINCIA :                   string;
      CodigoPostal :                string;
      MotivoAnulacion :             string;
      TipoMotivo :                  string;
      DESTipoMotivo :               string;
      TipoMedioPago :               number;
      MontoRetencion :              number;
      PorcentajeRetencion :         number;
      MontoDetraccion :             number;
      PorcentajeDetraccion :        number;

      num:                          number;


      NroPeticion:        string;
      FechaAdmision:      Date;      
      CorreoElectronico:  string;
      IdSede:             number;
      TotalDolares:       number;
      Redondeo:           number;
      Anticipo:           number;
      NombreCompleto:     string;
}