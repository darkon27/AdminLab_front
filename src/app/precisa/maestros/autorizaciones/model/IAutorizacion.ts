export class IAutorizacion{

    constructor(){
    }

    NRO:            string;
    AUTORIZADOR:    string;
    PACIENTE:       string;
    FECHA_INI:      string;  
    FECHA_FIN:      string;
    OBSERVACION:    string;
    AplicaTitular?: number;
    AplicaMonto?:   number;
    AplicaFormula?: number;
    Monto?:         number;
    ESTADO:         string; 
  
}
