import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { FooterLoginComponent } from '../../../@theme/components';
import { Portal } from '../model/portal';
import { Sedes } from '../model/sedes';
import { RequestPasswordComponent } from '../request-password/request-password.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { LoginService } from '../service/login.service';
import * as CryptoJS from 'crypto-js';
import { ExamenService } from '../../framework-comun/Examen/servicio/Examen.service';
import { VERSION_APLICATIVO } from '../../../data/constants/routes/api.routes';
import { Location } from '@angular/common';
import { convertDateStringsToDates } from '../../framework/funciones/dateutils';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild(RequestPasswordComponent, { static: false }) recuperarClave: RequestPasswordComponent;
  @ViewChild(ResetPasswordComponent, { static: false }) resetClave: ResetPasswordComponent;
  @ViewChild(FooterLoginComponent, { static: false }) footer: FooterLoginComponent;

  hide = true;
  sedes: SelectItem[] = []
  loginForm: FormGroup
  objPortal: Portal = new Portal()
  portal: Portal = new Portal()
  listSedes: Sedes = new Sedes()
  version = VERSION_APLICATIVO;
  
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
    ) { }

  ngOnInit(): void {
    const urldomain = document.domain;
    /*   const strdocument =  document; */
    const url = document.location.host;
    sessionStorage.clear();
    localStorage.clear();
    console.log("Login ngOnInit urldomain ::", urldomain);
    console.log("Login ngOnInit url ::", url);
    sessionStorage.setItem('access_url', JSON.stringify(url));
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.maxLength(50)]],
      clave: ['', [Validators.required, Validators.maxLength(100)]],
      idSede: ['', Validators.required]
    })
    this.cargarServicios();
    console.log("this.loginService.url;", this.loginService.url);

  }

  prueba() {
    this.loginService.prueba().then(
      res => console.log(res)
    )
  }

  get usuarioField() {
    return this.loginForm.get('usuario');
  }

  get passwordField() {
    return this.loginForm.get('clave');
  }

  get sedeField() {
    return this.loginForm.get('idSede');
  }


  login() {
    if (this.loginForm.valid) {
      Swal.fire({
        title: 'Espere por favor...',
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      console.log("datos", this.loginForm.value);
  
      return this.loginService.login2(this.loginForm.value).then(
        async res => {
          try {
            if (res.success) {
              let con = this.generarpsd();
              let auth = {
                success: res.success,
                data: res.data,
                tokem: res.tokem,
                valor: res.valor,
                mensaje: res.mensaje,
                encPass: CryptoJS.AES.encrypt(this.passwordField.value, con).toString(),
                encCon: btoa(con)
              };
              sessionStorage.setItem('access_user', JSON.stringify(auth));
              sessionStorage.setItem('access_user_token', JSON.stringify(res.tokem));
  
              let usuario = { usuario: this.usuarioField.value };
  
              // Manejar cada promesa individualmente
              try {
                await this.listarMiscelaneos();
                console.log('Miscelaneos cargados correctamente.');
              } catch (error) {
                console.error('Error al cargar miscelaneos:', error);
              }
  
              try {
                await this.listarCargarProcendia();
                console.log('Procedencia cargada correctamente.');
              } catch (error) {
                console.error('Error al cargar procedencia:', error);
              }
  
              try {
                await this.listarMenu(usuario);
                var listaEntyOperacion = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_menu')));
                if (!this.esListaVacia(listaEntyOperacion)) {                
                  console.log('Menú cargado correctamente.');
                }else{
                  /*    this.listarMenu(usuario);
                        console.log('Menú cargado dos veces.'); */
                }        
              } catch (error) {
                console.error('Error al cargar el menú:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error al cargar el menú',
                  text: 'No se pudo cargar el menú, inténtelo nuevamente.'
                });
                return; // No continuar si el menú no se carga correctamente
              }
  
              try {
                await this.mostrarIP();
                console.log('IP mostrada correctamente.');
              } catch (error) {
                console.error('Error al mostrar la IP:', error);
              }
  
              // Si todas las funciones críticas tuvieron éxito
              setTimeout(() => {
                window.location.reload();
              }, 100);
  
            } else {
              console.log("login ops:::::", res);
              Swal.fire({
                icon: 'warning',
                title: '¡Mensaje!',
                text: res.mensaje
              });
            }
          } catch (error) {
            console.error(`Error al obtener información inicial: ${error}`);
          } finally {
            // Acciones adicionales en finally si son necesarias
          }
        }
      ).catch(error => {
        Swal.fire({
          icon: 'warning',
          title: '¡Lo sentimos!',
          text: 'Intente más tarde'
        });
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }


  async listarCargarProcendia() {
    const procedencia = { Estado: 1 }
    const responseProcedencia: any[] = await this.loginService.listarEspecialidad(procedencia);
    console.log('Obt procedencia')
    if (responseProcedencia != null || responseProcedencia != undefined) {
      sessionStorage.setItem('access_Procendencia', JSON.stringify(responseProcedencia));
    } else {
      console.log("Error: Miscelaneos - procedencia", JSON.stringify(responseProcedencia));
    }

  }

  listarMiscelaneos() {
    let miscelaneos = { IdTablaMaestro: 0, IdCodigo: 0, Estado: 1 }
    this.loginService.listarMiscelaneos(miscelaneos).then(response => {
      Swal.close();
      console.log('Obt Micelaneos')
      if (response) {
        sessionStorage.setItem('access_miscelaneos', JSON.stringify(response));
      } else {
        console.log("Error: Miscelaneos", JSON.stringify(response));
      }
    })
  }

  mostrarIP() {
    var IP
    this.loginService.mostrarIp(IP).then((res) => {
      console.log("MOSTANDO IP", res)

      if (res) {
        sessionStorage.setItem('access_ip', JSON.stringify(res));
      } else {
        console.log("Error: IP", JSON.stringify(res));
      }

    });
  }

  listarMenu(usuario: any) {
    this.loginService.listarMenu(usuario, this.loginService.usuarioGetToken()).then(response => {
      Swal.close()
      if (response) {
        console.log("menu lleno:", JSON.stringify(response));
        sessionStorage.setItem('access_menu', JSON.stringify(response));

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Acceso Denegado'
        })
      }
    })
  }

  generarpsd() {
    let result = '';
    const characters = '0123456789';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * 10));    //sorteo
    }
    return result;
  }

  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      this.login();
    }
  }

  recupearClave() {
    this.recuperarClave.iniciarComponente()
  }

  resetearClave() {
    this.resetClave.iniciarComponente()
  }

  cargarServicios() {
    const p1 = this.listarSedes()
    Promise.all([p1]).then(
      f => {

      }
    );
  }

  listarSedes(): Promise<number> {
    let sedes = { IdEmpresa: 75300, SedEstado: 1 }
    console.log("Login listarSedes ::", this.loginForm);
    console.log("Login listarSedes ::", this.sedes);
    return this.loginService.listarSedes(sedes).then(
      sedes => {
        if (sedes.length > 0) {
          sedes.forEach(obj => this.sedes.push({ label: obj.SedDescripcion, value: obj.IdSede }));
          sessionStorage.setItem('access_sedes', JSON.stringify(sedes));
        }
        return 1
      }
    )
  }

  esListaVacia(lista: any): boolean {
    if (lista == null) {
        return true;
    }
    if (lista == undefined) {
        return true;
    }
    if (lista.length == 0) {
        return true;
    }
    return false;
}

}
