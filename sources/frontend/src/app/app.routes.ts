import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardUsuarioComponent } from './pages/dashboard-usuario/dashboard-usuario.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ConfigurarPerfilComponent } from './pages/configurar-perfil/configurar-perfil.component';
import { MaquinasComponent } from './pages/maquinas/maquinas.component';
import { MaquinaDetallesComponent } from './pages/maquina-detalles/maquina-detalles.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios.component';
import { GestionMaquinasComponent } from './pages/gestion-maquinas/gestion-maquinas.component';
import { Error404Component } from './pages/error-404/error-404.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard-usuario', component: DashboardUsuarioComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'configurar-perfil', component: ConfigurarPerfilComponent },
  { path: 'maquinas', component: MaquinasComponent },
  { path: 'maquina/:id', component: MaquinaDetallesComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'admin/gestion-usuarios', component: GestionUsuariosComponent },
  { path: 'admin/gestion-maquinas', component: GestionMaquinasComponent },
  { path: '**', component: Error404Component }
];