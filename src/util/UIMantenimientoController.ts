import { MensajeController } from "./MensajeController";

export declare interface UIMantenimientoController {

    btnEliminar?: boolean;
    btnNuevoAccion?: boolean;
    btnGuardar?: boolean;
    // listado
    coreNuevo(): void;
    coreBuscar(): void;

    // mantenimiento
    coreGuardar(): void;
    coreMensaje(mensage: MensajeController): void;
    // generico
    coreExportar(): void;
    coreSalir(): void;
    coreEliminar(): void;
    //Examen

}
