import { UsuarioSede } from "./usuariosede";

export class Usuario{

    constructor(){
        this.SedesPerfil=[]
    }

    Usuario:                string;
    UsuarioPerfil:          string;
    Nombre:                 string;
    Clave:                  string;
    ExpirarPasswordFlag:    string;
    FechaExpiracion?:       Date;
    Estado:                 string;
    UltimoUsuario:          string;
    UltimaFechaModif?:      Date;
    TipoUsuario:            number;
    Persona:                number;
    ClasificadorMovimiento: string;
    correo_empresa:         string;
    UsuarioCreacion?:       string;
    FechaCreacion?:         Date;

    Perfil:                 string;
    TipoDocumento:          string;
    NombreCompleto:         string;
    EstadoDes:              string;

    ClaveNueva:             string;
    DesTipoUsuario:         string;

    IdSede:                 number;
    SedesPerfil:            UsuarioSede[]
}