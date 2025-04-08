import { dtoCobranza } from "./dtoCobranza";
import { dtoCobranzadetalle } from "./dtoCobranzadetalle";

export class ModalCobranza {
    constructor() {
        this.cabecera;
        this.detalle=[];
    } 

   success:    boolean;
   valor:      number;
   tokem:      string;
   mensaje:    string;
   cabecera:   dtoCobranza = new dtoCobranza();
   detalle:    dtoCobranzadetalle[] = []; 
}
