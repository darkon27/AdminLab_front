import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ECommerceComponent } from '../pages/e-commerce/e-commerce.component';
import { PrecisaIndexComponent } from './precisa-index.component';


const routes: Routes = [{
  path: '',
  component: PrecisaIndexComponent,
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path:'caja',
      loadChildren: () => import('./caja/caja.module').then(m => m.CajaModule)
    },
    {
      path: 'liquidacion',
      loadChildren: () => import('./liquidacion/liquidacion.module').then(m => m.LiquidacionModule),
    },
    {
      path: 'facturacion',
      loadChildren: () => import('./comprobante/comprobante.module').then(m => m.ComprobanteModule),
    },
    {
      path: 'admision',
      loadChildren: () => import('./admision/admision.module').then(m => m.AdmisionModule),
    },
    {
      path: 'maestros',
      loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
    },
    {
      path: 'reportes',
      loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule),
    },
    {
      path: 'seguridad',
      loadChildren: () => import('./seguridad/seguridad.module').then(m => m.SeguridadModule),
    },
    // {
    //   path: 'consulta',
    //   loadChildren: () => import('./consulta/consulta.module').then(m => m.ConsultaModule),
    // },

    { path: 'notfound' ,  
     redirectTo: 'dashboard',      
      component: ECommerceComponent, },  
      {    path: '**',       loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),  pathMatch:'full'  },
/*     {
      path: '**',
      loadChildren: () => import('./miscellaneous/miscellaneous.module').then(m => m.MiscellaneousModule),
    }, */
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrecisaRoutingModule {
}
