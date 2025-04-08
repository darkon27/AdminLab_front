import { dtoExpediente } from "./dtoExpediente";
import { dtoExpedienteDetalle } from "./dtoExpedienteDetalle";

export class ExpedienteModal {
     constructor() {
         this.cabecera;
         this.detalle=[];
     } 

    success:    boolean;
    valor:      number;
    tokem:      string;
    mensaje:    string;
    cabecera:   dtoExpediente = new dtoExpediente();
    detalle:    dtoExpedienteDetalle[] = []; 
}
