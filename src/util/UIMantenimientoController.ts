import { MensajeController } from "./MensajeController";

export declare interface UIMantenimientoController {
    // listado
    coreNuevo(): void;
    coreBuscar(): void;
 
    // mantenimiento
    coreGuardar(): void;
    coreMensaje(mensage: MensajeController): void;
    // generico
    coreExportar(): void;
    coreSalir(): void;
    //Examen
    
}
