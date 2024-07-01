import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)

  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'pendientes',
    loadChildren: () => import('./pendientes/pendientes.module').then( m => m.PendientesPageModule)
  },
  {
    path: 'qrs',
    loadChildren: () => import('./qrs/qrs.module').then( m => m.QrsPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'altas',
    loadChildren: () => import('./altas/altas.module').then( m => m.AltasPageModule)
  },
  {
    path: 'alta-empleado',
    loadChildren: () => import('./alta-empleado/alta-empleado.module').then( m => m.AltaEmpleadoPageModule)
  },
  {
    path: 'alta-dueno-super',
    loadChildren: () => import('./alta-dueno-super/alta-dueno-super.module').then( m => m.AltaDuenoSuperPageModule)
  },
  {
    path: 'alta-producto',
    loadChildren: () => import('./alta-producto/alta-producto.module').then( m => m.AltaProductoPageModule)
  },
  {
    path: 'alta-mesa',
    loadChildren: () => import('./alta-mesa/alta-mesa.module').then( m => m.AltaMesaPageModule)
  },
  {
    path: 'encuestas',
    loadChildren: () => import('./encuestas/encuestas.module').then( m => m.EncuestasPageModule)
  },  {
    path: 'graficos',
    loadChildren: () => import('./graficos/graficos.module').then( m => m.GraficosPageModule)
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
